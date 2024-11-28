import * as urls from '../../utils/urls';
import { IconHelpOutline } from '../Icons';

export const HeaderBanner = () => {
	return (
		<div className="w-full px-10 h-[74px] bg-primaryYellow flex items-center justify-between">
			<img
				alt="Comment Converter Logo"
				src={urls.assets('logos/comment-converter-primary-logo-2.svg')}
				className="h-[30px]"
			/>
			<a
				className="flex items-center justify-center w-10 h-10 p-2 rounded-full text-primaryText bg-primaryYellow200 hover:bg-primaryYellow100 focus:outline-primaryYellow100 focus:shadow-none"
				href="https://commentconverter.com/docs/"
				target="_blank"
				rel="noopener noreferrer"
			>
				<IconHelpOutline width="24" height="24" />
			</a>
		</div>
	);
};
