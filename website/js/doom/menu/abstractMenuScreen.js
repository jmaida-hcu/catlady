/**
 * Base class of the Spipu-Doom menu screens: the socle skeleton
 * (AppMenuAbstractScreen) with the doom title, the WAD panels, the doom modals
 * and the WAD error messages.
 */

class AbstractMenuScreen extends AppMenuAbstractScreen {
    /**
     * @param {MenuNavigator} navigator
     * @param {AppMenuDisplay}   display
     */
    constructor(navigator, display) {
        super(display);

        this._navigator = navigator;
    }

    _titleText() {
        return 'Spipu-Doom';
    }

    _buildWadPanel(wadMeta, subtitleLabel) {
        return this._buildPanel(this._wadTitle(wadMeta) + ' — ' + subtitleLabel);
    }

    _wadTitle(meta) {
        return WadRegistry.displayTitle(meta);
    }

    _openAbout() {
        this._openModal(new MenuOptionsModal(this._display)).showAbout();
    }

    _openHelp() {
        this._openModal(new MenuOptionsModal(this._display)).showHelp();
    }

    _confirm(message, onConfirm) {
        return new MenuModal(this._display).confirm(message, onConfirm);
    }

    _showError(error) {
        this._setError(this._errorMessage(error));
    }

    // An error outside the WadError set is a genuine bug: it shows its raw
    // English message, which is what a report needs.
    _errorMessage(error) {
        const translationCodes = {
            'fetch-offline':       'error.fetchOffline',
            'fetch-blocked':       'error.fetchBlocked',
            'fetch-http':          'error.fetchHttp',
            'fetch-failed':        'error.fetchFailed',
            'invalid-format':      'error.invalidFormat',
            'quota-exceeded':      'error.quotaExceeded',
            'storage-unavailable': 'error.storageUnavailable',
            'not-found':           'error.notFound',
            'duplicate':           'error.wadDuplicate',
            'older-edition':       'error.wadOlder'
        };

        const code = ((error instanceof WadError) ? error.getCode() : null);
        if (translationCodes[code] === undefined) {
            return appTranslator.get('error.generic', {message: error.message});
        }
        const detail = error.getDetail();

        return appTranslator.get(translationCodes[code]) + ((detail !== null) ? ' (' + detail + ')' : '');
    }
}
