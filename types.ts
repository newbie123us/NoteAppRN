export enum Screens {
  Login = 'Login',
  Register = 'Register',
  Home = 'Home',
  Note = 'Note',
  Settings = 'Settings',
}

export type Note = {
  id: string;
  title: string;
  content: string;
  date: string;
};

export type RootStackParamList = {
  [Screens.Login]: undefined;
  [Screens.Register]: undefined;
  [Screens.Home]: undefined;
  [Screens.Note]: {
    noteId?: string;
    title?: string;
    content?: string;
  };
  [Screens.Settings]: undefined;
};
