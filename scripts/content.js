const waitForElm = (selector) => {
    return new Promise((resolve) => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver((mutations) => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    });
};

const url = "https://chat.openai.com/?model=text-davinci-002-render-sha";
const searchParams = new URLSearchParams(window.location.search);
const searchQuery = searchParams.get("q");

if (searchQuery && searchQuery.startsWith(".")) {
    chrome.storage.sync.set({ searchQuery: searchQuery });
    location.href = url;
}

if (!searchQuery && location.href == url) {
    const promise = new Promise((resolve, reject) => {
        chrome.storage.sync.get("searchQuery", (data) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(data);
            }
        });
    });

    promise
        .then((data) => {
            const retrievedQuery = data.searchQuery;
            const queryWithoutPrefix = retrievedQuery.substring(1);
            waitForElm("#__next > div > div > div > main > div > div > div > div > div > div").then(() => {
                const inputField = document.querySelector("#__next > div > div > div > main > div > form > div > div > textarea");
                inputField.value = queryWithoutPrefix;
                const enterKeyDownEvent = new KeyboardEvent("keydown", {
                    key: "Enter",
                    code: "Enter",
                    keyCode: 13,
                    which: 13,
                    bubbles: true,
                    cancelable: true,
                });
                inputField.dispatchEvent(enterKeyDownEvent);
                chrome.storage.sync.remove("searchQuery");
            });
        })
        .catch((error) => {
            console.error(error);
        });
}
