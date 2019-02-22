import { Injectable } from '@nestjs/common';
import { ConversationState, UserState } from 'botbuilder';

@Injectable()
export class State {
    constructor(private conversationState: ConversationState, private userState: UserState) {}

    public getConversationState(): ConversationState {
        return this.conversationState;
    }

    public getUserState(): UserState {
        return this.userState;
    }
}
