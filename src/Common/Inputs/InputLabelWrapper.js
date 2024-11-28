import classNames from 'classnames';
import { InputLabelWrapper as InputLabelWrapperBase } from '../../Lib/Components/Inputs/InputLabelWrapper';

export function InputLabelWrapper(props) {
	const { className, ...rest } = props;

	const classes = classNames('text-primaryText text-sm font-bold', className);

	return <InputLabelWrapperBase {...rest} className={classes} />;
}
