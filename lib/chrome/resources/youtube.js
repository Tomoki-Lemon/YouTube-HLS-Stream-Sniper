import './helper/formats.js'
import './helper/util.js'
import './helper/sig.js'
import './helper/extras.js'
import './helper/info.js'

// Examples:
// https://www.youtube.com/watch?v=G4fxtGH_lrU -> segmented
// https://www.youtube.com/watch?v=7lTDkfZs_5s -> no audio bitrate
// https://www.youtube.com/watch?v=23UGN3qqBWY -> filename with '.'

window.getFullInfo = async href => {
  const id = window.info.getVideoID(href);
  return window.info.getFullInfo(id).then(async o => {
    // TODO: REMOVE AFTER UPDATE
    if (o.videoDetails === undefined) {
      const packed = JSON.stringify(o);
      const a = /publishDate":"([^"]+)"/.exec(packed);
      o.videoDetails = {
        title: o.title,
        author: {},
        videoId: o['video_id'],
        publishDate: a ? a[1] : 'NA'
      };
      if (o.author) {
        o.videoDetails.author.name = o.author.name || o.author;
      }
      else {
        const b = /"author":"([^"]+)"/.exec(packed);
        if (b) {
          o.videoDetails.author.name = b[1];
        }
      }
    }

    let dom;
    for (const format of o.formats) {
      try {
        if (format.isDashMPD) {
          if (!dom) {
            const parser = new DOMParser();
            const content = await fetch(format.url).then(r => r.text());
            dom = parser.parseFromString(content, 'text/xml');
          }
          const node = [...dom.querySelectorAll('Representation')]
            .filter(node => node.id === format.itag.toString()).shift();
          if (node) {
            try {
              const base = node.querySelector('BaseURL').textContent;
              format.url = [...node.querySelectorAll('SegmentList *')].map(e => base + (e.attributes.sourceURL || e.attributes.media).value)
            }
            catch (e) {
              console.warn('Unable to Parse', node);
            }
          }
        }
      }
      catch (e) {
        console.warn('Cannot parse DashMPD', e);
      }
    }
    // remove unsupported formats
    o.formats = o.formats.filter(f => f.live === false && f.isHLS === false && (
      f.mimeType.startsWith('video/') || f.mimeType.startsWith('audio/')
    ));
    // make sure audio bitrates are available and sorted
    o.formats = o.formats.map(f => {
      if (f.mimeType.startsWith('audio/') && !f.audioBitrate && f.bitrate) {
        const rates = [32, 96, 128, 192, 256, 320];
        const ds = rates.map(v => Math.abs(v - f.bitrate / 1000));
        const index = ds.indexOf(Math.min(...ds));
        f.audioBitrate = rates[index];
      }
      return f;
    }).sort((a, b) => {
      if (a.mimeType.startsWith('audio/') && b.mimeType.startsWith('audio/')) {
        return b.audioBitrate - a.audioBitrate;
      }
    });

    return o;
  });
};
window.chooseFormat = (formats, quality) => {
  return window.info.chooseFormat(o.formats, {
    quality
  });
}

