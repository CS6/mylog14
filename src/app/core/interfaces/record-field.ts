export type RecordFieldValue = number | string | boolean;

export enum RecordFieldType {
   integer = 'integer',
   number = 'number',
   string = 'string',
   boolean = 'boolean',
}

export interface RecordFieldValueRange {
    max: number;
    min: number;
}

export interface RecordField {
    readonly name: string;
    readonly icon: string;
    readonly type: RecordFieldType;
    readonly defaultValue: RecordFieldValue;
    value: RecordFieldValue;
    readonly valueUnit?: string;
    readonly valueRange?: RecordFieldValueRange;
}

