/**************************************************************************/
/**************************************************************************/
/**************************************************************************/
/**************************************************************************/
declare class GodotPositionReportingProcessor {
    static get parameterDescriptors(): {
        name: string;
        defaultValue: number;
        minValue: number;
        maxValue: number;
        automationRate: string;
    }[];
    constructor(...args: any[]);
    position: number;
    process(inputs: any, _outputs: any, parameters: any): boolean;
}
