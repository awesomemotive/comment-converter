import React, { useState } from 'react';

/**
 * Hook to help to manage the modal state.
 *
 * @param {Component} Modal  The modal component.
 * @param {bool}      isOpen The inital open state.
 * @return {Array} An array containing the actual modal, a open modal method, and a close modal method.
 */
export function useModal(Modal, isOpen) {
	const [settings, setSettings] = useState({
		isOpen: !!isOpen,
	});

	const modal = (props) => {
		return <Modal {...props} {...settings} />;
	};

	const openModal = (settings) => {
		if ('string' === typeof settings) {
			settings = {
				message: settings,
			};
		}
		setSettings({
			...settings,
			isOpen: true,
		});
	};

	const closeModal = () => {
		setSettings({
			isOpen: false,
		});
	};

	return [modal, openModal, closeModal];
}
