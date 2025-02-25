enum AnswerType {
    SingleChoice = 0,
    MultipleChoice = 1,
    Input = 2
}

export abstract class Answer {
    type: AnswerType;
    id: number;
    content: any;

    constructor(type: AnswerType, id: number, content: Object) {
        this.id = id;
        this.type = type;
        this.content = content;
    }

    equals(other: Answer): boolean {
        return this.isEqual(other);
    }

    abstract isEqual(ans: Answer): boolean;
    abstract fromJSON(json: any): Answer;

    // Static factory method to detect child class and deserialize
    static deserialize(jsonString: string): Answer {
        const json = JSON.parse(jsonString);
        switch (json.type) {
            case AnswerType.SingleChoice:
                const instance: SingleChoiceAnswer = SingleChoiceAnswer.prototype.fromJSON(json);
                return instance;
            default:
                throw new Error(`Unknown AnswerType: ${json.type}`);
        }
    }
}


export class SingleChoiceAnswer extends Answer {
    content: string;

    constructor(id: number, content: string) {
        super(AnswerType.SingleChoice, id, content);
        this.content = content;
    }

    override isEqual(ans: SingleChoiceAnswer) {
        return this.content == ans.content;
    }

    override fromJSON(json: any): SingleChoiceAnswer {
        return new SingleChoiceAnswer(json.id, json.content);
    }
}