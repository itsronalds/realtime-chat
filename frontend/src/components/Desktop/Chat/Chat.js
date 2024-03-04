import './Chat.css';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuthContext } from './../../../contexts/AuthContext';
import axios from './../../../utils/axios';
import { io } from 'socket.io-client';
import Profile from './../Profile/Profile';
import ChatRoom from './../ChatRoom/ChatRoom';

// Variable donde añadiremos el socket y el ENDPOINT donde se realizaran las peticiones sockets
const ENDPOINT = 'http://localhost:4000';
let socket;

const Chat = () => {
  // Función para actualizar la autenticación cuando haya una desconexión
  const { setIsAuth } = useAuthContext();

  // Variable para poder ir a otras rutas
  const history = useHistory();

  // Estado para renderizar el componente
  const [loadComponent, setLoadComponent] = useState(false);

  // Estado para mostrar los chat activos
  const [showActiveChats, setShowActiveChats] = useState(true);

  // Estado para mis datos de usuario
  const [profile, setProfile] = useState({});

  // Estado de usuarios encontrados
  const [usersFound, setUsersFound] = useState([]);

  // Estado de todos los chats activos
  const [activeChats, setActiveChats] = useState([]);

  // Estado del chat actual
  const [currentChat, setCurrentChat] = useState({});

  // Variable para contener el mensaje a enviar
  const message = useRef('');

  // Variable que contiene el nombre del usuario a buscar
  const findUserFullname = useRef('');

  // Estado para mostrar el emoji picker
  const [emojiPicker, setEmojiPicker] = useState(false);

  // Todos los chats memorizados para optimizar rendimiento
  const memorizedActiveChats = useMemo(() => activeChats, [activeChats]);

  // Memorizar el chat actual para evitar renderizaciones innecesarias
  const memorizedCurrentChat = useMemo(() => currentChat, [currentChat]);

  // Obtenemos todos los datos de la cuenta de usuario juntos a los chats activos
  useEffect(() => {
    socket = io(ENDPOINT, {
      query: {
        token: document.cookie,
      },
    });

    const getAccountData = async () => {
      try {
        const request = await axios.get('/api/private/user/data');
        const { success, data, activeChats } = request.data;

        if (success === false) {
          const { auth, role, message } = request.data;

          auth === false && role === '' ? alert(message) : null;

          history.push('/');

          return setIsAuth({
            auth,
            role,
          });
        }

        if (success === true) {
          // Actualizamos los chats activos solo si los hay
          setActiveChats(activeChats);

          // Actualizamos todos los datos de la cuenta
          setProfile(data);

          // Habilitamos para renderizar el componente Chat.js
          setLoadComponent(true);
        }
      } catch (err) {
        console.log('Ocurrio un error con axios');
      }
    };

    getAccountData();
  }, []);

  useEffect(() => {
    socket.on('message', async (message) => {
      if (memorizedActiveChats.length > 0) {
        const { messageOutgoingUserId: IDUser } = message;

        for (let i = 0; i < memorizedActiveChats.length; i++) {
          if (memorizedActiveChats[i].user.IDUser === IDUser) {
            const activeChatsClone = [...memorizedActiveChats];
            activeChatsClone[i].chats.push(message);

            setActiveChats(activeChatsClone);

            // No hay chat seleccionado, por tanto, no hacemos nada
            if (Object.keys(memorizedCurrentChat).length === 0) {
              return;
            }

            // Analizamos si el mensaje entrante corresponde al chat activo
            if (memorizedCurrentChat.IDUser === IDUser) {
              if (
                memorizedCurrentChat.chat[memorizedCurrentChat.chat.length - 1]
                  .IDMessage === message.IDMessage
              ) {
                return;
              }

              const currentChatClone = { ...memorizedCurrentChat };
              currentChatClone.chat.push(message);

              setCurrentChat(currentChatClone);
            }
            return;
          }
        }

        // Este codigo va aplicado en caso de no estar el chat registrado, se crea uno nuevo
        const request = await axios.post('/api/private/user/data/chat', {
          IDUser,
        });
        const { success, user } = request.data;

        if (success === true) {
          const data = {
            user,
            chats: [message],
          };

          return setActiveChats((state) => [...state, data]);
        }
      }

      const { messageOutgoingUserId: IDUser } = message;

      const request = await axios.post('/api/private/user/data/chat', {
        IDUser,
      });
      const { success, user } = request.data;

      if (success === true) {
        const data = {
          user,
          chats: [message],
        };

        setActiveChats((state) => [...state, data]);

        if (
          memorizedCurrentChat.IDUser === IDUser &&
          !memorizedCurrentChat.chat
        ) {
          setCurrentChat((state) => ({ ...state, chat: [message] }));
        }
      }
    });

    socket.on('user status: online', (user) => {
      const { IDUser, status } = user;

      // Socket pendiente de si el usuario con el que se iniciara el chat se conecto
      if (
        !memorizedCurrentChat.chat &&
        memorizedCurrentChat.IDUser === IDUser
      ) {
        setCurrentChat((state) => ({ ...state, userStatus: status }));
      }

      for (let i = 0; i < memorizedActiveChats.length; i++) {
        if (memorizedActiveChats[i].user.IDUser === IDUser) {
          if (memorizedCurrentChat?.IDUser === IDUser) {
            setCurrentChat((state) => ({ ...state, userStatus: status }));
          }

          const newActiveChat = [...memorizedActiveChats];
          newActiveChat[i].user.userStatus = status;

          return setActiveChats(newActiveChat);
        }
      }
    });

    socket.on('user status: offline', (user) => {
      const { IDUser, status } = user;

      // Socket pendiente de si el usuario con el que se iniciara el chat se desconecto
      if (
        !memorizedCurrentChat.chat &&
        memorizedCurrentChat.IDUser === IDUser
      ) {
        setCurrentChat((state) => ({ ...state, userStatus: status }));
      }

      for (let i = 0; i < memorizedActiveChats.length; i++) {
        if (memorizedActiveChats[i].user.IDUser === IDUser) {
          if (memorizedCurrentChat?.IDUser === IDUser) {
            setCurrentChat((state) => ({ ...state, userStatus: status }));
          }

          const newActiveChat = [...memorizedActiveChats];
          newActiveChat[i].user.userStatus = status;

          return setActiveChats(newActiveChat);
        }
      }
    });

    socket.on('Invalid access', (errorMessage) => {
      const { success, auth, role, message } = errorMessage;

      if (success === false) {
        auth === false && role === '' ? alert(message) : null;

        history.push('/');

        return setIsAuth({
          auth,
          role,
        });
      }
    });

    return () => socket.off();
  }, [memorizedActiveChats, memorizedCurrentChat]);

  const findUser = async () => {
    const { value } = findUserFullname.current;

    if (value.length > 0) {
      try {
        const request = await axios.get(`/api/private/user/find/${value}`);
        const { success, users } = request.data;

        if (success === false) {
          const { auth, role, message } = request.data;

          auth === false && role === '' ? alert(message) : null;

          history.push('/');

          return setIsAuth({
            auth,
            role,
          });
        }

        if (success === true) {
          setUsersFound(users);
        }
      } catch (err) {
        console.log('Ocurrio un error con axios');
      }
    }
  };

  const sendMessage = useCallback(async () => {
    setEmojiPicker(false);

    const { value } = message.current;

    // Objeto con el mensaje y el id de la persona que lo recibirá
    const messageObj = {
      message: value,
      incomingUserId: memorizedCurrentChat.IDUser,
    };

    try {
      const request = await axios.post(
        '/api/private/user/message/send',
        messageObj
      );
      const { success, newMessage } = request.data;

      if (success === false) {
        const { auth, role, message } = request.data;

        auth === false && role === '' ? alert(message) : null;

        history.push('/');

        return setIsAuth({
          auth,
          role,
        });
      }

      if (success === true) {
        message.current.value = '';

        // Enviamos el mensaje al servidor socket
        socket.emit('message', newMessage);

        // Si el estado de activeChats es > 0, significa que hay chats agregados
        if (memorizedActiveChats.length > 0) {
          const { messageIncomingUserId } = newMessage;

          // Si ya hay chats agregados en activeChats, se procede a buscar el chat correspondiente al mensaje
          for (let i = 0; i < memorizedActiveChats.length; i++) {
            if (memorizedActiveChats[i].user.IDUser === messageIncomingUserId) {
              // Si el chat existe procedemos a añadir el nuevo mensaje
              const activeChatsClone = [...memorizedActiveChats];
              activeChatsClone[i].chats.push(newMessage);

              // Actualizamos el estado de activeChats con el nuevo mensaje en su chat correspondiente
              setActiveChats(activeChatsClone);

              // Si la prop chat del estado currentChat existe, agregamos el nuevo mensaje a chat prop
              if (memorizedCurrentChat?.chat) {
                // Buscamos si el mensaje ya existe en currentChat, si existe no actualizamos el estado
                const { chat } = memorizedCurrentChat;
                const { IDMessage } = newMessage;

                if (chat[chat.length - 1].IDMessage === IDMessage) {
                  return;
                }

                // Si el mensaje no esta, se actualiza el estado junto al nuevo mensaje
                const currentChatClone = { ...memorizedCurrentChat };
                currentChatClone.chat.push(newMessage);

                return setCurrentChat(currentChatClone);
              }

              return;
            }
          }
          // Si el chat no existe en activeChats, se procede a crearlo
          const user = memorizedCurrentChat;
          const data = {
            user,
            chats: [newMessage],
          };

          setActiveChats((state) => [...state, data]);

          // Si la prop chat no existe en currentChat, se crea e introduce el nuevo mensaje
          if (!memorizedCurrentChat.chat) {
            setCurrentChat((state) => ({
              ...state,
              chat: [newMessage],
            }));
          }

          return;
        }
        // En caso que no sea > 0, no hay chats, por tanto, hay que agregar uno nuevo

        // Obtenemos los datos de usuario del chat actual y lo agregamos al objeto user
        const user = memorizedCurrentChat;

        // Creamos el objeto con los datos del usuario y su mensaje
        const data = {
          user,
          chats: [newMessage],
        };

        // Actualizamos el estado de activeChats introduciendo el nuevo chat creado
        setActiveChats((state) => [...state, data]);

        // Tambien actualizamos el estado de currentChat agregando la propiedad chat con su mensaje
        setCurrentChat((state) => ({ ...state, chat: [newMessage] }));
      }
    } catch (err) {
      console.log(err);
    }
  }, [memorizedActiveChats, memorizedCurrentChat]);

  const handleCurrentChat = (chat) => {
    if (emojiPicker === true) {
      setEmojiPicker(false);
    }

    // Mostrar los chats activos al seleccionar un chat y limpiar input de busqueda de usuarios
    if (findUserFullname.current.value.length > 0) {
      findUserFullname.current.value = '';
      setUsersFound([]);
      setShowActiveChats(true);
    }

    // Obtenemos el id del usuario seleccionado
    const { IDUser } = chat;

    // Si el estado de activeChats es > 0, significa que ya hay chats activos
    if (memorizedActiveChats.length > 0) {
      // Recorremos todos los chats activos para validar si ya hay mensajes guardados del usuario seleccionado
      for (let i = 0; i < memorizedActiveChats.length; i++) {
        if (memorizedActiveChats[i].user.IDUser === IDUser) {
          const currentChat = chat;
          currentChat.chat = memorizedActiveChats[i].chats;

          // Actualizamos el chat actual con sus mensajes correspondientes agregados
          return setCurrentChat(currentChat);
        }
      }

      return setCurrentChat(chat);
    }

    // # En caso que el chat no exista procedemos a crearlo
    setCurrentChat(chat);
  };

  const disconnect = async () => {
    try {
      const request = await axios.get('/api/auth/logout');
      const { success, auth } = request.data;

      if (success === true) {
        // Desconectamos el socket del usuario
        socket.close();

        history.push('/');

        setIsAuth(auth);
      }
    } catch (err) {
      console.log('Error con axios');
    }
  };

  return (
    loadComponent && (
      <div className="desktopChat">
        <Profile
          profile={profile}
          findUserFullname={findUserFullname}
          findUser={findUser}
          {...{
            usersFound,
            setUsersFound,
            showActiveChats,
            setShowActiveChats,
          }}
          activeChats={memorizedActiveChats}
          handleCurrentChat={handleCurrentChat}
          disconnect={disconnect}
        />

        {/* Mostrar el componente solo cuando haya un chat activo */}
        {Object.keys(memorizedCurrentChat).length > 0 ? (
          <ChatRoom
            profile={profile}
            currentChat={memorizedCurrentChat}
            message={message}
            sendMessage={sendMessage}
            {...{ emojiPicker, setEmojiPicker }}
          />
        ) : (
          <div
            style={{
              backgroundColor: 'rgb(241, 241, 241',
              width: '65%',
              borderRadius: '20px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <span style={{ fontSize: '20px' }}>Welcome, start a chat!</span>
          </div>
        )}
      </div>
    )
  );
};

export default Chat;
