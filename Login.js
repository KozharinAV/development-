//"База данных" для хранения имен пользователей и паролей
const userDatabase = new Map();
//Множество залогиненных пользователей
const loggedUsers = new Set();

const SystemMessages = {
  USER_EXISTS: "user already exists",
  USER_ADDED: "new user added",
  NO_SUCH_USER: "no such user",
  PASSWORD_FAIL: "incorrect password",
  ALREADY_LOGGED: "already logged in",
  SUCCESS_LOGING: "user logged in",
  ALREADY_LOGGED_OUT: "already logged out",
  SUCCESS_LOGGED_OUT: "user logged out",
};

const ActionTypes = {
  REGISTER: "register",
  LOGIN: "login",
  LOGOUT: "logout",
};
const MessageTypes = {
  FAIL: "fail",
  SUCCESS: "success",
};
const registerUser = (userName, password) => {
  if (userDatabase.has(userName)) return `${MessageTypes.FAIL}: ${SystemMessages.USER_EXISTS}`;
  userDatabase.set(userName, password);
  return `${MessageTypes.SUCCESS}: ${SystemMessages.USER_ADDED}`;
};

const loginUser = (userName, password) => {
  if (!userDatabase.has(userName)) return `${MessageTypes.FAIL}: ${SystemMessages.NO_SUCH_USER}`;
  if (userDatabase.get(userName) !== password)
    return `${MessageTypes.FAIL}: ${SystemMessages.PASSWORD_FAIL}`;
  if (loggedUsers.has(userName)) return `${MessageTypes.FAIL}: ${SystemMessages.ALREADY_LOGGED}`;
  loggedUsers.add(userName);
  return `${MessageTypes.SUCCESS}: ${SystemMessages.SUCCESS_LOGING}`;
};

const logoutUser = (userName) => {
  if (!userDatabase.has(userName)) return `${MessageTypes.FAIL}: ${SystemMessages.NO_SUCH_USER}`;
  if (!loggedUsers.has(userName))
    return `${MessageTypes.FAIL}: ${SystemMessages.ALREADY_LOGGED_OUT}`;
  loggedUsers.delete(userName);
  return `${MessageTypes.SUCCESS}: ${SystemMessages.SUCCESS_LOGGED_OUT}`;
};

const processUser = (request) => {
  const requestData = request.split(" ");
  switch (requestData[0]) {
    case ActionTypes.REGISTER:
      console.log(registerUser(requestData[1], requestData[2]));
      return;
    case ActionTypes.LOGIN:
      console.log(loginUser(requestData[1], requestData[2]));
      return;
    case ActionTypes.LOGOUT:
      console.log(logoutUser(requestData[1]));
      return;
    default:
      return;
  }
};

const initialData = [
  "register vasya 12345",
  "login vasya 1234",
  "login vasya 12345",
  "login anakin C-3PO",
  "logout vasya",
  "logout vasya",
];

initialData.forEach((request) => processUser(request));
