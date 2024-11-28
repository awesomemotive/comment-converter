import { CheckboxGroupBase } from '../../Lib/Components/Inputs/CheckboxGroupBase';
import { CheckboxInput } from './CheckboxInput';

export function CheckboxGroup(props) {
	return <CheckboxGroupBase {...props} CheckboxInputComponent={CheckboxInput} />;
}
