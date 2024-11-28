import { IconPerson } from '../../../Common/Icons';
import styled from 'styled-components';

const Wrapper = styled.div`
	display: flex;
	align-items: center;
	padding: 3px;
	border-radius: 2px;
	background-color: ${(props) => props.theme.neutral30};
	color: ${(props) => props.theme.primaryText};
	font-weight: 700;
	line-height: 1;
	font-size: 12px;

	svg {
		width: 12px;
		height: 12px;
		margin-right: 3px;
	}
`;

export function Badge(props) {
	const { children } = props;

	return (
		<Wrapper>
			<IconPerson />
			{children}
		</Wrapper>
	);
}
