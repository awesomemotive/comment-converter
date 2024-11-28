import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';
import { CustomPicker } from 'react-color';
import { Saturation, Hue, Alpha, Checkboard } from 'react-color/lib/components/common';
import { hexToRgbA, hexToRgbARaw, isRgba } from '../../util/hexColors';
import ColorPickerFields from './ColorPickerFields';
import get from 'lodash/get';
import colorLib from 'color';
import { IconPlus, IconStepDown, IconStepUp } from '../Icons';
import classnames from 'classnames';
import { usePrevious } from '../../hooks/usePrevious';

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;

	width: 280px;
	background: #fff;
	box-sizing: initial;
`;

const SaturationWrapper = styled.div`
	width: auto;
	padding-bottom: 143px;
	margin-left: 20px;
	margin-right: 20px;
	margin-top: 20px;
	position: relative;
	border-radius: 2px 2px 0 0;
	overflow: hidden;
`;

const Body = styled.div`
	padding: 14px 0 9px 0;
`;

const Controls = styled.div`
	display: flex;
	padding-left: 20px;
	padding-right: 20px;
`;

const Color = styled.div`
	width: 45px;
`;

const AddProfileButton = styled.button`
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
	width: 18px;
	height: 18px;
	border-radius: 100%;
	cursor: pointer;
	border: 1px solid #e9ecf3;
	background-color: #e9ecf3;
	color: #60697a;

	&:hover {
		background-color: #abb7ce;
		color: #f9fbff;
	}

	svg {
		height: 12px;
		width: 12px;
		pointer-events: none;
	}
`;

const pulseAnimation = keyframes`
	0% { transform: scale(1); opacity: 1; }
	100% { transform: scale(2); opacity: 0; }
`;

const ProfileSwatch = styled.button`
	display: block;
	position: relative;
	width: 18px;
	height: 18px;
	border-radius: 100%;
	overflow: hidden;
	cursor: pointer;
	&.added-color {
		overflow: visible;
		:after {
			content: '';
			position: absolute;
			inset: 0px;
			background-color: ${(props) => {
				// If color is light, add a gray pulse color, otherwise, use the swatch as the pulse color.
				return 0.9 < colorLib(props.value).luminosity()
					? '#abb7ce'
					: `rgba(${props.rgb.r}, ${props.rgb.g}, ${props.rgb.b}, ${props.rgb.a})`;
			}};
			border-radius: 100%;
			animation: ${pulseAnimation} 1s 1;
		}
	}
	> * {
		pointer-events: none;
	}
`;

const CurrentSwatch = styled.div`
	width: 36px;
	height: 36px;
	border-radius: 100%;
	position: relative;
	overflow: hidden;
`;

const SwatchColor = styled.div`
	position: absolute;
	inset: 0px;
	border-radius: 100%;
	box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
	background: ${(props) => `rgba(${props.rgb.r}, ${props.rgb.g}, ${props.rgb.b}, ${props.rgb.a})`};
	z-index: 2;
`;

const Toggles = styled.div`
	flex: 1;
	padding-right: 8px;
`;

const HueWrapper = styled.div`
	height: 12px;
	position: relative;
	margin-bottom: 10px;
`;

const AlphaWrapper = styled.div`
	height: 12px;
	position: relative;
`;

const SaturationPointer = styled.div`
	width: 20px;
	height: 20px;
	border-radius: 20px;
	background: rgba(255, 255, 255, 0.2);
	border: 1px solid white;
	box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
	box-sizing: border-box;
	transform: translate(-10px, -10px);
`;

const HueAlphaPointer = styled.div`
	width: 14px;
	height: 14px;
	border-radius: 6px;
	transform: translate(-6px, -1px);
	background-color: rgb(248, 248, 248);
	box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.37);
`;

const FieldsWrapper = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: flex-start;

	padding-top: 16px;
	padding-left: 20px;
	padding-right: 20px;
`;

const FieldsToggle = styled.div`
	width: 8px;
	height: 18px;
	background-color: #fff;
	display: flex;
	flex-direction: column;
	margin: 6px 7px 6px 0;
	padding: 0px;
	box-sizing: border-box;
`;

const FieldsToggleButton = styled.button`
	-webkit-appearance: none;
	-moz-appearance: none;
	background-color: transparent;
	border: none;
	height: 50%;
	width: 8px;
	display: flex;
	justify-content: center;
	align-items: flex-start;
	margin: 0px;
	padding: 0px;
	cursor: ${(props) => (!props.disabled ? 'pointer' : 'default')};

	&:focus {
		outline-color: ${(props) => hexToRgbA('#087ce1', '0.25')};
		outline-width: 1px;
	}

	svg {
		color: #abb7ce;
	}

	+ button {
		align-items: flex-end;
	}
`;

const ClearButton = styled.button`
	appearance: none;
	width: 46px;
	height: 30px;
	box-sizing: border-box;
	padding: 0 7px;
	margin-left: 10px;
	border-radius: 4px;
	border: none;
	background-color: #e9ecf3;
	color: #60697a;
	font-size: 14px;
	font-weight: 500;
	font-family: inherit;
	cursor: pointer;

	&:hover {
		background-color: #abb7ce;
	}

	&:focus {
		outline-color: ${(props) => hexToRgbA('#087ce1', '0.25')};
		outline-width: 1px;
	}
`;

const PresetColors = styled.div`
	border-top: 1px solid #e9ecf3;
	margin-top: 14px;
	margin-bottom: 13px;
	padding-top: 7px;
	padding-left: 20px;
	padding-right: 20px;
	position: relative;

	span {
		color: #60697a;
		font-size: 10px;
		font-weight: 500;
	}
`;

const PresetColorList = styled.div`
	display: flex;
	margin-top: 10px;
	cursor: pointer;

	> button {
		margin-left: 5px;

		&:first-child {
			margin-left: 0px;
		}
	}
`;

const EditColorProfile = styled.button`
	background: #087ce1;
	border-radius: 2px;
	color: #fff;
	font-size: 10px;
	position: absolute;
	width: 28px;
	height: 16px;
	right: 20px;
	top: 12px;

	&:hover {
		cursor: pointer;
		background: #0b6ec3;
	}
`;

function ColorPickerBase(props) {
	const {
		className,
		color,
		defaultView = 'hex',
		hex,
		hsl,
		hsv,
		onChange,
		onChangeColor,
		onChangeComplete,
		presetColors,
		renderers,
		rgb,
		colorProfileControl = {
			enabled: true,
			colorExistsFn: () => false,
			addColorFn: () => {},
			onEditProfileClick: () => {},
		},
	} = props;
	const classes = classnames('ColorPicker', className);
	const [fieldsView, setFieldsView] = useState(defaultView);
	const prevDefault = usePrevious(defaultView);
	const [addedColor, setAddedColor] = useState('');
	const isHexView = fieldsView === 'hex';
	const newColor = isHexView
		? hex
		: colorLib
				.rgb(get(rgb, 'r', 0), get(rgb, 'g', 0), get(rgb, 'b', 0))
				.alpha(get(rgb, 'a', 1))
				.toString();

	const canAddColorProfile = !colorProfileControl.colorExistsFn(newColor);

	useEffect(() => {
		if (prevDefault && prevDefault !== defaultView) {
			setFieldsView(defaultView);
		}
	}, [prevDefault, defaultView, setFieldsView]);

	/**
	 * Checks if given color is the same as the addedColor state.
	 *
	 * @param {string} color The color to check.
	 *
	 * @return {bool} Whether given color is the same as the addedColor state.
	 */
	const isAddedColor = (color) => {
		const added = addedColor ? addedColor.toLowerCase() : '';
		color = color ? color.toLowerCase() : '';

		return added === color;
	};

	/**
	 * Sets the addedColor state temporarily (which handles the class/CSS animation).
	 *
	 * @param {string} color The new color.
	 *
	 * @return {void}
	 */
	const pulseColor = (color) => {
		setAddedColor(color);

		if (color) {
			// After animation completes, remove class.
			setTimeout(() => setAddedColor(''), 650);
		}
	};

	/**
	 * The `react-color` `onChange` callback.
	 *
	 * This helps `react-color` manage it's internal state. The
	 * `onChangeComplete` callback is where we dispatch to Redux, or some other
	 * external state.
	 *
	 * @param {Object|string} data   The `onChange` event data.
	 * @param {string}        origin The origin of the change event.
	 *
	 * @return {void}
	 */
	const handleChange = (data, origin) => {
		// Check for 0% opacity (transparent).
		const isTransparent = get(data, 'a') === 0;
		const isClearing = get(data, 'clear');
		const maybeUpdateAlpha = isTransparent && !isClearing && !['alpha', 'fields', 'hue'].includes(origin);

		// If a color got selected and the opacity is 0, let's update the opacity to 1.
		if (maybeUpdateAlpha && (get(data, 's') !== get(color, 's') || get(data, 'v') !== get(color, 'v'))) {
			data.a = 1;
		}

		onChange(data);
		onChangeColor(data);

		// Check for 100% opacity (opaque).
		const isOpaque = get(data, 'a') === undefined || get(data, 'a') === 1;

		// Intelligently switch color picker views, based on opacity.
		if (isOpaque && !isHexView && origin !== 'fields') {
			setFieldsView('hex');
		} else if (!isOpaque && isHexView && origin !== 'fields') {
			setFieldsView('rgb');
		}
	};

	/**
	 * Toggles between the `rgb` and `hex` color picker fields.
	 *
	 * @return {void}
	 */
	const handleToggleFieldView = () => {
		setFieldsView(isHexView ? 'rgb' : 'hex');
	};

	/**
	 * The clear button `onClick` callback.
	 *
	 * Sets the color (internally and externally---in Redux) to transparent.
	 *
	 * @return {void}
	 */
	const handleClearColor = () => {
		handleChange({ a: 0, h: 0, s: 0, l: 0, clear: true });
	};

	/**
	 * Handle when the edit color profile button is clicked.
	 *
	 * @return {void}
	 */
	const handleEditColorProfile = () => {
		colorProfileControl.onEditProfileClick();
	};

	/**
	 * Handles adding a new color.
	 *
	 * @return {void}
	 */
	const handleMaybeAddColor = () => {
		if (canAddColorProfile) {
			colorProfileControl.addColor(newColor);
		}

		pulseColor(newColor);
	};

	/**
	 * Handles clicking/selecting a profile color.
	 *
	 * @param {Object} event The profile swatch `onClick` event.
	 *
	 * @return {void}
	 */
	const handleProfileClick = (event) => {
		const color = get(event, 'target.value');
		setFieldsView(isRgba(color) ? 'rgb' : 'hex');
		onChangeComplete(color);
	};

	return (
		<Wrapper className={classes}>
			<SaturationWrapper>
				<Saturation
					hsl={hsl}
					hsv={hsv}
					pointer={SaturationPointer}
					onChange={(data) => handleChange(data, 'saturation')}
				/>
			</SaturationWrapper>
			<Body>
				<Controls>
					<Color>
						<CurrentSwatch>
							<SwatchColor rgb={rgb} />
							<Checkboard renderers={renderers} />
						</CurrentSwatch>
					</Color>
					<Toggles>
						<HueWrapper>
							<Hue
								radius="2px"
								hsl={hsl}
								pointer={HueAlphaPointer}
								onChange={(data) => handleChange(data, 'hue')}
							/>
						</HueWrapper>
						<AlphaWrapper>
							<Alpha
								radius="2px"
								rgb={rgb}
								hsl={hsl}
								pointer={HueAlphaPointer}
								renderers={renderers}
								onChange={(data) => handleChange(data, 'alpha')}
							/>
						</AlphaWrapper>
					</Toggles>
				</Controls>
				<FieldsWrapper>
					<FieldsToggle>
						<FieldsToggleButton onClick={handleToggleFieldView}>
							<IconStepUp height={5} width={8} />
						</FieldsToggleButton>
						<FieldsToggleButton onClick={handleToggleFieldView}>
							<IconStepDown height={5} width={8} />
						</FieldsToggleButton>
					</FieldsToggle>
					<ColorPickerFields
						rgb={rgb}
						hsl={hsl}
						hex={hex}
						view={fieldsView}
						onChange={(data) => handleChange(data, 'fields')}
					/>
					<ClearButton onClick={handleClearColor}>Clear</ClearButton>
				</FieldsWrapper>
				{colorProfileControl.enabled && (
					<PresetColors>
						<span>Color Profile</span>
						<EditColorProfile onClick={handleEditColorProfile}>Edit</EditColorProfile>
						<PresetColorList>
							<AddProfileButton
								onClick={handleMaybeAddColor}
								title="Add selected color to current Color Profile"
							>
								<IconPlus />
							</AddProfileButton>

							{(presetColors || []).map((profileColor, k) => {
								const profileRgb = hexToRgbARaw(profileColor);
								return (
									<ProfileSwatch
										key={k}
										value={profileColor}
										className={isAddedColor(profileColor) ? 'added-color' : ''}
										rgb={profileRgb}
										onClick={handleProfileClick}
									>
										<SwatchColor rgb={profileRgb} />
										<Checkboard renderers={renderers} />
									</ProfileSwatch>
								);
							})}
						</PresetColorList>
					</PresetColors>
				)}
			</Body>
		</Wrapper>
	);
}

ColorPickerBase.propTypes = {
	className: PropTypes.string,
	color: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
	colorProfileControl: PropTypes.shape({
		enabled: PropTypes.bool,
		colorExistsFn: PropTypes.func,
		addColorFn: PropTypes.func,
		onEditProfileClick: PropTypes.func,
	}),
	defaultView: PropTypes.oneOf(['hex', 'rgb', 'hsl']),
	hex: PropTypes.string,
	hsl: PropTypes.object,
	hsv: PropTypes.object,
	onChange: PropTypes.func,
	onChangeColor: PropTypes.func.isRequired,
	onChangeComplete: PropTypes.func.isRequired,
	presetColors: PropTypes.array,
	renderers: PropTypes.object,
	rgb: PropTypes.object,
};

export default CustomPicker(ColorPickerBase);
