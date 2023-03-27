var thumbs = ['👍', '👍🏻', '👍🏼', '👍🏽', '👍🏾', '👍🏿'];
const THUMBS_PER_BYTE = 4;

function encode() {
    var textToEncode = document.getElementById("input").value;
    var encoder = new TextEncoder();
    var encoded = encoder.encode(textToEncode);
    var thumbsUpEncoded = "";
    for (var i in encoded) {
        var toBase6 = encoded[i].toString(6);
        var startingZeroes = (THUMBS_PER_BYTE - toBase6.length);
        for (var j = 0; j < startingZeroes; j++) {
            thumbsUpEncoded += thumbs[0];
        } 
        while (toBase6 !== "") {
            var firstDigit = toBase6[0];
            thumbsUpEncoded += thumbs[firstDigit];
            toBase6 = toBase6.substring(1, toBase6.length);
        }
    }

    document.getElementById("output").value = thumbsUpEncoded;
}

function decode() {
    var textToDecode = document.getElementById("output").value;
    var decodedTextThumbs = Array.from(textToDecode);
    var thumbBase6 = [];
    for (var i = 0; i < decodedTextThumbs.length; i++){
        if (thumbs[0] == decodedTextThumbs[i]) {
            if (i + 1 < decodedTextThumbs.length && decodedTextThumbs[i + 1] !== thumbs[0]) {
                thumbBase6.push((decodedTextThumbs[i + 1].charCodeAt(1) - "🏻".charCodeAt(1)) + 1);
            } else {
                thumbBase6.push(0);
            }
        }
    }
    if (thumbBase6.length % THUMBS_PER_BYTE !== 0) {
        document.getElementById("input").value = "Improperly formatted";
        return;
    }
    
    var fullLength = thumbBase6.length / THUMBS_PER_BYTE;
    var decoded = new Uint8Array(fullLength);
    for (var i = 0; i < fullLength; i++) {
        var fromBase6 = "";
        for (var j = 0; j < THUMBS_PER_BYTE; j++) {
            fromBase6 += thumbBase6[i * THUMBS_PER_BYTE + j];
        }
        decoded[i] = parseInt(fromBase6, 6);
    }
    var decoder = new TextDecoder();
    var decodedMessage = decoder.decode(decoded);
    document.getElementById("input").value = decodedMessage;
}