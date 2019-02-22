import { Injectable } from '@nestjs/common';
import { ConversationState } from 'botbuilder';

@Injectable()
export class State {
    constructor(private conversationState: ConversationState) {}

    public getConversationState(): ConversationState {
        return this.conversationState;
    }
}
