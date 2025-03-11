import { IInputs, IOutputs } from "./generated/ManifestTypes";
import './CSS/TimePicker.css';
export class TimePickerControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private container: HTMLDivElement;
    private hourDropdown: HTMLSelectElement;
    private minuteDropdown: HTMLSelectElement;
    private amPmDropdown: HTMLSelectElement;
    private notifyOutputChanged: () => void;
    private selectedTime = "12:00 AM";

    constructor() {
                //
    }

    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement
    ): void {
        this.notifyOutputChanged = notifyOutputChanged;
        this.container = container;

        // Create Hours Dropdown (1-12)
        this.hourDropdown = document.createElement("select");
        this.hourDropdown.classList.add("time-dropdown");
        for (let i = 1; i <= 12; i++) {
            const option = document.createElement("option");
            option.value = i.toString();
            option.text = i.toString();
            this.hourDropdown.appendChild(option);
        }

        // Create Minutes Dropdown (00-59)
        this.minuteDropdown = document.createElement("select");
        this.minuteDropdown.classList.add("time-dropdown");
        for (let i = 0; i < 60; i += 5) { // 5-minute intervals
            const option = document.createElement("option");
            option.value = i.toString().padStart(2, "0");
            option.text = i.toString().padStart(2, "0");
            this.minuteDropdown.appendChild(option);
        }

        // Create AM/PM Dropdown
        this.amPmDropdown = document.createElement("select");
        this.amPmDropdown.classList.add("time-dropdown");
        ["AM", "PM"].forEach((period) => {
            const option = document.createElement("option");
            option.value = period;
            option.text = period;
            this.amPmDropdown.appendChild(option);
        });

        // Event Listeners to update time
        this.hourDropdown.addEventListener("change", this.updateTime.bind(this));
        this.minuteDropdown.addEventListener("change", this.updateTime.bind(this));
        this.amPmDropdown.addEventListener("change", this.updateTime.bind(this));

        // Append Elements
        const wrapper = document.createElement("div");
        wrapper.classList.add("time-picker-container");
        wrapper.appendChild(this.hourDropdown);
        wrapper.appendChild(document.createTextNode(":"));
        wrapper.appendChild(this.minuteDropdown);
        wrapper.appendChild(this.amPmDropdown);

        this.container.appendChild(wrapper);
    }

    private updateTime(): void {
        const hour = this.hourDropdown.value;
        const minute = this.minuteDropdown.value;
        const amPm = this.amPmDropdown.value;
        this.selectedTime = `${hour}:${minute} ${amPm}`;
        this.notifyOutputChanged();
    }

    public updateView(context: ComponentFramework.Context<IInputs>): void {
        if (context.parameters.selectedTime.raw) {
            this.selectedTime = context.parameters.selectedTime.raw;
            const [time, period] = this.selectedTime.split(" ");
            const [hour, minute] = time.split(":");
            this.hourDropdown.value = hour;
            this.minuteDropdown.value = minute;
            this.amPmDropdown.value = period;
        }
    }

    public getOutputs(): IOutputs {
        return { selectedTime: this.selectedTime };
    }

    public destroy(): void {
        // Cleanup if needed
    }
}
