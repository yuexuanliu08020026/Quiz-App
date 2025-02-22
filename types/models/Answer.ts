enum AnswerType {
    SingleChoice,
    MultipleChoice,
    Input
}
  
export abstract class Answer {
    type:       AnswerType;
    id:         number;
    content:    any;

    constructor(type: AnswerType, id:number, content:Object){
        this.id = id;
        this.type = type;
        this.content = content;
    }

    equals(other: Answer): boolean {
        return this.isEqual(other);
    }

    abstract isEqual(ans:Answer): boolean;
    abstract fromJSON(json:any):Answer;

    // Static factory method to detect child class and deserialize
    static deserialize(jsonString: string): Answer {
        const json = JSON.parse(jsonString);

        if (!json.type) {
        throw new Error("Invalid JSON: Missing type field");
        }

        switch (json.type) {
        case AnswerType.SingleChoice:
            return SingleChoiceAnswer.prototype.fromJSON(json);
        default:
            throw new Error(`Unknown AnswerType: ${json.type}`);
        }
    }
}


export class SingleChoiceAnswer extends Answer{
    content:   number;

    constructor(id: number, content: number) {
        super(AnswerType.SingleChoice, id, content);
        this.content = content;
    }

    override isEqual(ans: SingleChoiceAnswer){
        return this.content == ans.content;
    }

    override fromJSON(json: any): SingleChoiceAnswer {
        if (typeof json.content !== "number") {
          throw new Error("Invalid JSON: content must be a number for SingleChoiceAnswer");
        }
        return new SingleChoiceAnswer(json.id, json.content);
      }
}