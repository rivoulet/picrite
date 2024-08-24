async function shareWithShare(url: string) {
    try {
        await navigator.share({
            url,
        });
        return true;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
        return false;
    }
}

async function shareWithClipboard(url: string) {
    if (!("clipboard" in navigator)) return false;
    try {
        await navigator.clipboard.writeText(url);
        return true;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
        return false;
    }
}

function shareWithTextArea(url: string) {
    const textArea = document.createElement("textarea");
    textArea.value = url;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    let success = false;
    try {
        success = document.execCommand("copy");
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
        /* empty */
    }
    document.body.removeChild(textArea);
    return success;
}

export async function shareURL(url: string) {
    if ("share" in navigator) {
        return { success: shareWithShare(url), usedClipboard: false };
    } else if (await shareWithClipboard(url)) {
        return { success: true, usedClipboard: true };
    } else {
        return { success: shareWithTextArea(url), usedClipboard: true };
    }
}
