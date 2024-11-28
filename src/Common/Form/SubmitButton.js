import PropTypes from 'prop-types';
import classNames from 'classnames';
import { PrimaryButton } from '../Buttons/BaseButton';
import { IconCheck2, IconRefresh, IconWarning } from '../Icons';

export const SubmitButton = (props) => {
	const { onSubmit, children, submissionStatus, ...rest } = props;

	const statusIconClasses = classNames('ml-[5px] text-white', {
		'animate-spin': submissionStatus.isLoading,
	});

	let StatusIcon = null;

	if (submissionStatus.isLoading) {
		StatusIcon = IconRefresh;
	} else if (submissionStatus.isError) {
		StatusIcon = IconWarning;
	} else if (submissionStatus.isSuccess) {
		StatusIcon = IconCheck2;
	}

	return (
		<PrimaryButton onClick={onSubmit} {...rest}>
			{children}
			{StatusIcon ? <StatusIcon width={10} className={statusIconClasses} /> : null}
		</PrimaryButton>
	);
};

SubmitButton.propTypes = {
	children: PropTypes.node.isRequired,
	onSubmit: PropTypes.func.isRequired,
	submissionStatus: PropTypes.shape({
		isLoading: PropTypes.bool,
		isSuccess: PropTypes.bool,
		isError: PropTypes.bool,
	}),
};
