import PropTypes from 'prop-types';
import { ShadowBox } from '../../../../Common/Layout/ShadowBox';

export const Total = (props) => {
	const { count, title } = props;

	return (
		<ShadowBox className="justify-center items-center text-center p-[30px] h-[145px]">
			<span className="text-primaryText text-[48px] leading-[62px] font-bold">{count}</span>
			<span className="text-primaryText text-lg leading-6 font-normal">{title}</span>
		</ShadowBox>
	);
};

Total.propTypes = {
	count: PropTypes.number.isRequired,
	title: PropTypes.string.isRequired,
};
