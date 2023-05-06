chrome.tabs
    .query({ active: true, currentWindow: true })
    .then((tabs) => {
        console.log("hit");
        var url = tabs[0].url;
        var searchQuery = "";

        // Check if the search query has a prefix
        if (url.startsWith(".")) {
            // Extract the query without the prefix
            var queryWithoutPrefix = searchQuery.substring(1);
            // Redirect the user to a different website based on the query
            chrome.tabs.update({ url: "https://chat.openai.com/" });
        } else {
            // Do something with the regular search query, such as storing it in local storage
            localStorage.setItem("searchQuery", searchQuery);
        }
    })
    .catch(function (error) {
        console.error("Error: " + error);
    });
