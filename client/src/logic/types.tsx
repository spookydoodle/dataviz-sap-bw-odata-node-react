import { ReactChild, ReactChildren } from 'react';

type Children = ReactChild | ReactChildren | Array<ReactChild>;

type Mode = 'light' | 'dark' | undefined;

type DrawerVariant = 'persistent' | 'temporary';

type Input =
    | 'button'
    | 'checkbox'
    | 'color'
    | 'date'
    | 'datetime-local'
    | 'email'
    | 'file'
    | 'hidden'
    | 'image'
    | 'month'
    | 'number'
    | 'password'
    | 'radio'
    | 'range'
    | 'reset'
    | 'search'
    | 'submit'
    | 'tel'
    | 'text'
    | 'time'
    | 'url'
    | 'week';

interface UserObject {
    _id: string;
    email: string;
    publicName: string;
    darkMode: boolean | undefined;
}
type User = UserObject | undefined | null;
interface UserData {
    objectId: string;
    email: string;
    publicName: string;
    darkMode: boolean | undefined;
}

interface Auth {
    username: string;
    password: string;
    team: string;
    email: string;
}

interface Login {
    email: string,
    password: string,
}

interface State {
    user: User | null;
    whoamiRequestDone: boolean;
    mode: Mode;
    data?: Array<StateData>;
}

type StateDataFunc = () => StateData;

interface Dimension {
    key: string;
    text: string;
}
interface Measure {
    value: number | string;
    unit?: string;
}
interface StateData {
    country: Dimension;
    division: Dimension;
    month: Dimension;
    year: Dimension;
    qty: Measure;
    sales: Measure;
};


export type {
    Children,
    Auth,
    Login,
    User,
    UserData,
    Mode,
    DrawerVariant,
    Input,
    Dimension,
    Measure,
    StateData,
    State,
}