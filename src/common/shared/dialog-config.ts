import { StatePropertyAccessor } from "botbuilder";
import { ComponentDialog } from "botbuilder-dialogs";

export interface DialogRoute {
    dialogId: string;
    api: string;
}

export interface DialogConfig {
    [intent: string]: DialogRoute;
}

export interface IComponentDialog extends ComponentDialog {
    initializeUserProfileAccessor(userProfileAccessor: StatePropertyAccessor<any>);
}

export enum Routes {
    BASE = '/api'
}