// For importing jQuery through browser console -- might have to run code twice

var jq = document.createElement('script');
jq.src = "https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js";
document.getElementsByTagName('head')[0].appendChild(jq);
// ... give time for script to load, then type (or see below for non wait option)
jQuery.noConflict();


// For querying the CrossRef API on console and saving as "data"


// For querying the CrossRef API on console and getting category-name (i.e. subject area)

$.ajax({
    url: `https://api.crossref.org/works?query.bibliographic=%22large%20language%20models%22&facet=category-name:*`,
    success: function (data) {
        window.queryResult;
        queryResult = data // caches query as queryResult

        window.categoryName;
        categoryName = queryResult["message"]["facets"]["category-name"]['values']

    }})

// For collecting all DOIs, title, 

let query = "query.bibliographic=%22deep%20learning%20neural%20network%22&query=%22urban%22"// String, Boolean not supported; %22 means "; %20 means space
let filters = "category-name:Architecture,category-name:Artificial Intelligence,category-name:Computer Science Applications,category-name:Environmental Engineering,category-name:General Computer Science,category-name:Human-Computer Interaction,category-name:Information Systems,category-name:Information Systems and Management,category-name:Sensory Systems,category-name:Transportation,category-name:Urban Studies"// Strings, separated by comma
let csvText = "title@DOI@is-referenced-by-count@subject@container-title\n" // CSV headers 

initialQuery = (query, filters, csvText) => {$.ajax({
    url: `https://api.crossref.org/works?${query}&filter=${filters}&cursor=*`,
    success: function (data) {
        window.queryResult;
        queryResult = data // caches query as queryResult

        items = queryResult["message"]["items"]

        if (items.length>0){
            for (item of items) {
                title = item["title"] || "Not provided"
                csvText += JSON.stringify(title).replace("\n", "")
                csvText += "@"
                csvText += item["is-referenced-by-count"] || "Not provided"
                csvText += "@"
                csvText += item["subject"] || "Not provided"
                csvText += "@"
                csvText += item["container-title"] || "Not provided"
                csvText += "\n"
            }
            nextCursor = queryResult["message"]["next-cursor"]
            urlNext = `https://api.crossref.org/works?${query}&filter=${filters}&cursor=${nextCursor}`
            nextQuery(urlNext)
        }
    }})}

nextQuery = (urlNext) => {$.ajax({
    url: urlNext,
    success: function (data) {
        window.queryResult;
        queryResult = data // caches query as queryResult

        items = queryResult["message"]["items"]

        if (items.length>0){
            for (item of items) {
                title = item["title"] || "Not provided"
                csvText += JSON.stringify(title).replace("\n", "")
                csvText += "@"
                csvText += item["DOI"] || "Not provided"
                csvText += "@"
                csvText += item["is-referenced-by-count"] || "Not provided"
                csvText += "@"
                csvText += item["subject"] || "Not provided"
                csvText += "@"
                csvText += item["container-title"] || "Not provided"
                csvText += "\n"
            }
            nextQuery(urlNext)
        } else {
            console.log("All queries complete");
            console.log(csvText)
        }
    }})}

initialQuery(query, filters, csvText)