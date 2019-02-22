import { Injectable } from '@nestjs/common';
import { WaterfallStep, WaterfallStepContext, DialogTurnResult } from 'botbuilder-dialogs';
import { EventEmitter } from '@jkelio/event-emitter';

@Injectable()
export class GreetingView extends Array<WaterfallStep<any>> {
    public communicationBus: EventEmitter<any>;

    constructor() {
        super();
        this.communicationBus = new EventEmitter();
    }

    public initializeView() {
        this.push((step: WaterfallStepContext<any>): any => {
            this.communicationBus.emit('greet', step);
        });
    }
}
