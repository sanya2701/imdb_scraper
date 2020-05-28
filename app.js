const request = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs");
const json2csv = require("json2csv").Parser;

const movies = ["https://www.imdb.com/title/tt8420184/?ref_=hm_fanfav_tt_2_pd_fp1",
                "https://www.imdb.com/title/tt4154796/?ref_=hm_fanfav_tt_6_pd_fp1",
                "https://www.imdb.com/title/tt6751668/?ref_=hm_fanfav_tt_4_pd_fp1",
                "https://www.imdb.com/title/tt7286456/?ref_=hm_fanfav_tt_3_pd_fp1"];

(async()=>{
    let imdbData=[];
   
    for(let movie of movies)
    {
        const response = await request({
            uri:movie,
            headers:{
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "accept-encoding": "gzip, deflate, br",
                "accept-language": "en-GB,en-US;q=0.9,en;q=0.8"
            },
            gzip : true
        });
    
        const $ = cheerio.load(response);
        const title = $('div[class="title_wrapper"] > h1').text().trim();
        const rating = $('div[class="ratingValue"] > strong > span').text();
        const summary = $('div[class="summary_text"]').text().trim();
        const releaseDate =  $('a[title="See more release dates"]').text().trim();
    
        imdbData.push({
            title,rating,summary,releaseDate
        });
    }

    const j2cp = new json2csv();
    const csv = j2cp.parse(imdbData);

    fs.writeFileSync("./imdb.csv",csv,"utf-8");

})()