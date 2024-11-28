import { RadioButtonGroupBase } from '../../Lib/Components/Inputs/RadioButtonGroupBase';
import { RadioButtonInput } from './RadioButtonInput';

export function RadioButtonGroup(props) {
	return <RadioButtonGroupBase {...props} RadioButtonInputComponent={RadioButtonInput} />;
}
