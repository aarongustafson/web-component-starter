// Shared demo file. Change the starter source, not a component's copy.
const tabsControls = document.getElementById('demo-tabs-controls');
if (tabsControls) {
	const tabsStatus = document.getElementById('demo-tabs-status');
	enhanceTabs(tabsControls, tabsStatus).catch((error) => {
		console.error('Demo tabs could not load:', error);
		if (tabsStatus?.dataset.loadFailureMessage?.trim()) {
			tabsStatus.textContent = tabsStatus.dataset.loadFailureMessage;
			tabsStatus.hidden = false;
		}
	});
}

const status = document.getElementById('microlighter-status');
if (!status) throw new Error('Missing demo enhancement status element.');
const messages = {
	loading: status.dataset.loadingMessage,
	failure: status.dataset.failureMessage,
	themeFailure: status.dataset.themeFailureMessage,
};
for (const [name, message] of Object.entries(messages)) {
	if (!message?.trim()) {
		throw new Error(`Missing authored demo enhancement message: ${name}`);
	}
}
status.hidden = false;
status.textContent = messages.loading;

function reportFailure(error) {
	console.error('MicroLighter could not load:', error);
	status.hidden = false;
	status.textContent = messages.failure;
}

try {
	if (typeof Highlight !== 'function' || !globalThis.CSS?.highlights) {
		throw new Error('CSS Custom Highlight API unavailable.');
	}

	let themeFailed = false;
	let enhanced = false;
	function reportThemeFailure() {
		status.hidden = false;
		status.textContent = messages.themeFailure;
	}
	const theme = document.createElement('link');
	theme.rel = 'stylesheet';
	theme.href =
		'https://cdn.jsdelivr.net/npm/microlighter@2.2.0/dist/themes/github.css';
	theme.dataset.codeTheme = '';
	theme.media = 'print';
	theme.addEventListener(
		'load',
		() => {
			theme.media = 'all';
		},
		{ once: true },
	);
	theme.addEventListener(
		'error',
		() => {
			themeFailed = true;
			console.error(
				'MicroLighter theme could not load:',
				new Error('Optional syntax theme unavailable.'),
			);
			if (enhanced) reportThemeFailure();
		},
		{ once: true },
	);
	document.head.insertBefore(
		theme,
		document.head.querySelector('link[rel="stylesheet"]'),
	);

	const panels = [...document.querySelectorAll('micro-lighter[language]')];
	const grammars = {
		html: () =>
			import('https://cdn.jsdelivr.net/npm/microlighter@2.2.0/dist/grammars/html.js'),
		css: () =>
			import('https://cdn.jsdelivr.net/npm/microlighter@2.2.0/dist/grammars/css.js'),
		javascript: () =>
			import('https://cdn.jsdelivr.net/npm/microlighter@2.2.0/dist/grammars/javascript.js'),
		json: () =>
			import('https://cdn.jsdelivr.net/npm/microlighter@2.2.0/dist/grammars/json.js'),
		bash: () =>
			import('https://cdn.jsdelivr.net/npm/microlighter@2.2.0/dist/grammars/bash.js'),
	};
	const loaded = new Set();
	async function loadGrammar(language) {
		if (!Object.hasOwn(grammars, language)) {
			throw new Error(`Unsupported demo language: ${language}`);
		}
		if (loaded.has(language)) return;
		loaded.add(language);
		const { default: grammar } = await grammars[language]();
		await Promise.all((grammar.dependencies ?? []).map(loadGrammar));
	}
	await Promise.all(
		panels.map((panel) => loadGrammar(panel.getAttribute('language'))),
	);
	await import('https://cdn.jsdelivr.net/npm/microlighter@2.2.0/dist/micro-lighter-element.min.js');
	// The pinned highlighter requires one text node and swallows grammar failures.
	for (const panel of panels) {
		const code = panel.querySelector(':scope > pre > code');
		if (code?.children.length) code.textContent = code.textContent;
	}
	enhanced = true;
	if (themeFailed) {
		reportThemeFailure();
	} else {
		status.textContent = '';
		status.hidden = true;
	}
} catch (error) {
	reportFailure(error);
}

async function enhanceTabs(controls, tabsStatus) {
	const button = controls.querySelector('button');
	const state = button?.querySelector('[data-tabs-state]');
	if (!button || !state || !tabsStatus) {
		throw new Error('Missing authored demo tabs controls or status.');
	}
	const storageKey = 'web-component-demo-tabs';
	const labels = {
		preference: tabsStatus.dataset.preferenceFailureMessage,
		failure: tabsStatus.dataset.loadFailureMessage,
		code: controls.dataset.codeLabel,
		live: controls.dataset.liveLabel,
		on: controls.dataset.onLabel,
		off: controls.dataset.offLabel,
	};
	for (const [name, message] of Object.entries(labels)) {
		if (!message?.trim()) {
			throw new Error(`Missing authored demo tabs message: ${name}`);
		}
	}
	function reportPreferenceFailure(error) {
		console.error(
			'Demo tabs preference could not be saved or read:',
			error,
		);
		tabsStatus.textContent = labels.preference;
		tabsStatus.hidden = false;
	}
	function readPreference() {
		const value = localStorage.getItem(storageKey);
		if (value === null) return null;
		if (!['on', 'off'].includes(value)) {
			throw new Error('Unrecognized demo tabs preference.');
		}
		return value === 'on';
	}
	let enabled = true;
	try {
		enabled = readPreference() ?? true;
	} catch (error) {
		reportPreferenceFailure(error);
	}
	const examples = [...document.querySelectorAll('.code-demo-pair')].map(
		(pair) => {
			const tabs = pair.querySelector(
				':scope > tabbed-interface[data-demo-tabs]',
			);
			const code = tabs?.querySelector(':scope > micro-lighter');
			const live = tabs?.querySelector(':scope > .demo');
			const codeHeading = tabs?.querySelector(
				':scope > [data-demo-tab="code"]',
			);
			const liveHeading = tabs?.querySelector(
				':scope > [data-demo-tab="live"]',
			);
			const heading = pair.parentElement.querySelector(
				':scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > h6',
			);
			if (!code || !live || !heading || !codeHeading || !liveHeading) {
				throw new Error(
					'Demo tabs require a permanent host, authored headings, and a code/live pair.',
				);
			}
			codeHeading.textContent = labels.code;
			liveHeading.textContent = labels.live;
			tabs.setAttribute('role', 'group');
			tabs.setAttribute('aria-label', heading.textContent.trim());
			tabs.addEventListener('tabbed-interface:change', (event) => {
				if (event.target === tabs) {
					tabs.dataset.demoTabsPanel =
						event.detail.tabIndex === 0 ? 'code' : 'live';
				}
			});
			return { pair, code, live, tabs, initialPanel: null };
		},
	);
	const initialInteractions = new AbortController();
	for (const example of examples) {
		for (const [index, column] of [example.code, example.live].entries()) {
			for (const type of ['click', 'input', 'change']) {
				column.addEventListener(
					type,
					() => {
						example.initialPanel = index;
					},
					{ capture: true, signal: initialInteractions.signal },
				);
			}
		}
	}
	try {
		await import('https://cdn.jsdelivr.net/npm/@aarongustafson/tabbed-interface@3.1.0/define.js');
	} finally {
		initialInteractions.abort();
	}

	function setEnabled(value) {
		const focusHost = document.activeElement;
		let focused = focusHost;
		while (focused?.shadowRoot?.activeElement) {
			focused = focused.shadowRoot.activeElement;
		}
		let restoreFocus = false;
		for (const example of examples) {
			const { pair, code, live, tabs } = example;
			const hasFocus =
				live.contains(focusHost) || code.contains(focusHost);
			if (hasFocus) restoreFocus = true;
			if (value && (hasFocus || example.initialPanel !== null)) {
				const index = hasFocus
					? live.contains(focusHost)
						? 1
						: 0
					: example.initialPanel;
				tabs.setAttribute('default-tab', String(index));
				if (tabs.layout !== null) tabs.activeIndex = index;
			}
			example.initialPanel = null;
			tabs.presentation = value ? 'tabs' : 'linear';
			tabs.dataset.demoTabsPanel =
				tabs.activeIndex === 1 ? 'live' : 'code';
			pair.toggleAttribute('data-demo-tabs-active', value);
		}
		enabled = value;
		button.setAttribute('aria-pressed', String(value));
		state.textContent = value ? labels.on : labels.off;
		controls.hidden = false;
		if (restoreFocus) {
			(focused.isConnected ? focused : button).focus({
				preventScroll: true,
			});
		}
	}
	setEnabled(enabled);
	button.addEventListener('click', () => {
		setEnabled(!enabled);
		try {
			localStorage.setItem(storageKey, enabled ? 'on' : 'off');
			if (readPreference() !== enabled) {
				throw new Error(
					'Browser did not retain the demo tabs preference.',
				);
			}
			tabsStatus.textContent = '';
			tabsStatus.hidden = true;
		} catch (error) {
			reportPreferenceFailure(error);
		}
	});
}
