var kaner_allow_stream_av = document.querySelector('input[id="_allow_stream_av"]');
var kaner_allow_stream_v = document.querySelector('input[id="_allow_stream_v"]');
var kaner_allow_stream_a = document.querySelector('input[id="_allow_stream_a"]');
var kaner_allow_format_mp4 = document.querySelector('input[id="_allow_format_mp4"]');
var kaner_allow_format_flv = document.querySelector('input[id="_allow_format_flv"]');
var kaner_allow_format_3gp = document.querySelector('input[id="_allow_format_3gp"]');
var kaner_allow_format_webm = document.querySelector('input[id="_allow_format_webm"]');
var kaner_allow_format_m4a = document.querySelector('input[id="_allow_format_m4a"]');
var kaner_allow_format_ogg = document.querySelector('input[id="_allow_format_ogg"]');

var kaner_stored_options = {
        _allow_stream_av: true,
        _allow_stream_v: true,
        _allow_stream_a: true,
        _allow_format_mp4: true,
        _allow_format_flv: true,
        _allow_format_3gp: true,
        _allow_format_webm: true,
        _allow_format_m4a: true,
        _allow_format_ogg: true
}

function onErrorForStorage(e) {
        console.error(e);
}

function restoreOptions(storedSettings) {

        if (!storedSettings.kaner_stored_options) {
                browser.storage.local.set({kaner_stored_options});
        }
        kaner_stored_options._allow_stream_av = storedSettings.kaner_stored_options._allow_stream_av;
        kaner_stored_options._allow_stream_v = storedSettings.kaner_stored_options._allow_stream_v;
        kaner_stored_options._allow_stream_a = storedSettings.kaner_stored_options._allow_stream_a;
        kaner_stored_options._allow_format_mp4 = storedSettings.kaner_stored_options._allow_format_mp4;
        kaner_stored_options._allow_format_flv = storedSettings.kaner_stored_options._allow_format_flv;
        kaner_stored_options._allow_format_3gp = storedSettings.kaner_stored_options._allow_format_3gp;
        kaner_stored_options._allow_format_webm = storedSettings.kaner_stored_options._allow_format_webm;
        kaner_stored_options._allow_format_m4a = storedSettings.kaner_stored_options._allow_format_m4a;
        kaner_stored_options._allow_format_ogg = storedSettings.kaner_stored_options._allow_format_ogg;

        if (kaner_stored_options._allow_stream_av == false) kaner_allow_stream_av.checked = null;
        if (kaner_stored_options._allow_stream_v == false) kaner_allow_stream_v.checked = null;
        if (kaner_stored_options._allow_stream_a == false) kaner_allow_stream_a.checked = null;
        if (kaner_stored_options._allow_format_mp4 == false) kaner_allow_format_mp4.checked = null;
        if (kaner_stored_options._allow_format_flv == false) kaner_allow_format_flv.checked = null;
        if (kaner_stored_options._allow_format_3gp == false) kaner_allow_format_3gp.checked = null;
        if (kaner_stored_options._allow_format_webm == false) kaner_allow_format_webm.checked = null;
        if (kaner_stored_options._allow_format_m4a == false) kaner_allow_format_m4a.checked = null;
        if (kaner_stored_options._allow_format_ogg == false) kaner_allow_format_ogg.checked = null;
}

var kanerStoredOptions = browser.storage.local.get();
kanerStoredOptions.then(restoreOptions, onErrorForStorage);

function storeOptions() {
        browser.storage.local.set({
                kaner_stored_options: {
                        _allow_stream_av: kaner_stored_options._allow_stream_av,
                        _allow_stream_v: kaner_stored_options._allow_stream_v,
                        _allow_stream_a: kaner_stored_options._allow_stream_a,
                        _allow_format_mp4 : kaner_stored_options._allow_format_mp4,
                        _allow_format_flv : kaner_stored_options._allow_format_flv,
                        _allow_format_3gp : kaner_stored_options._allow_format_3gp,
                        _allow_format_webm : kaner_stored_options._allow_format_webm,
                        _allow_format_m4a : kaner_stored_options._allow_format_m4a,
                        _allow_format_ogg : kaner_stored_options._allow_format_ogg
                }
        });
}

kaner_allow_stream_av.addEventListener('change', () => {
        if(kaner_allow_stream_av.checked) {
                kaner_stored_options._allow_stream_av = true;
        } else {
                kaner_stored_options._allow_stream_av = false;
        }
        storeOptions();
});

kaner_allow_stream_v.addEventListener('change', () => {
        if(kaner_allow_stream_v.checked) {
                kaner_stored_options._allow_stream_v = true;
        } else {
                kaner_stored_options._allow_stream_v = false;
        }
        storeOptions();
});

kaner_allow_stream_a.addEventListener('change', () => {
        if(kaner_allow_stream_a.checked) {
                kaner_stored_options._allow_stream_a = true;
        } else {
                kaner_stored_options._allow_stream_a = false;
        }
        storeOptions();
});

kaner_allow_format_mp4.addEventListener('change', () => {
        if(kaner_allow_format_mp4.checked) {
                kaner_stored_options._allow_format_mp4 = true;
        } else {
                kaner_stored_options._allow_format_mp4 = false;
        }
        storeOptions();
});

kaner_allow_format_flv.addEventListener('change', () => {
        if(kaner_allow_format_flv.checked) {
                kaner_stored_options._allow_format_flv = true;
        } else {
                kaner_stored_options._allow_format_flv = false;
        }
        storeOptions();
});

kaner_allow_format_3gp.addEventListener('change', () => {
        if(kaner_allow_format_3gp.checked) {
                kaner_stored_options._allow_format_3gp = true;
        } else {
                kaner_stored_options._allow_format_3gp = false;
        }
        storeOptions();
});

kaner_allow_format_webm.addEventListener('change', () => {
        if(kaner_allow_format_webm.checked) {
                kaner_stored_options._allow_format_webm = true;
        } else {
                kaner_stored_options._allow_format_webm = false;
        }
        storeOptions();
});

kaner_allow_format_m4a.addEventListener('change', () => {
        if(kaner_allow_format_m4a.checked) {
                kaner_stored_options._allow_format_m4a = true;
        } else {
                kaner_stored_options._allow_format_m4a = false;
        }
        storeOptions();
});

kaner_allow_format_ogg.addEventListener('change', () => {
        if(kaner_allow_format_ogg.checked) {
                kaner_stored_options._allow_format_ogg = true;
        } else {
                kaner_stored_options._allow_format_ogg = false;
        }
        storeOptions();
});



/*
 var kaner_allow_stream_av = document.querySelector('input[id="_allow_stream_av"]');
var kaner_allow_stream_v = document.querySelector('input[id="_allow_stream_v"]');
var kaner_allow_stream_a = document.querySelector('input[id="_allow_stream_a"]');

kaner_allow_stream_av.addEventListener('change', () => {
        if(kaner_allow_stream_av.checked) {
                browser.storage.local.set({
                        kaner_stored_options: {
                                _allow_stream_av: false,
                                _allow_stream_v: false,
                                _allow_stream_a: false
                        }
                });

                console.log('ticked checked');
        } else {
                browser.storage.local.set({
                        kaner_stored_options: {
                                _allow_stream_av: true,
                                _allow_stream_v: true,
                                _allow_stream_a: true
                        }
                });
                console.log('ticked un-checked');
        }
});

 */
