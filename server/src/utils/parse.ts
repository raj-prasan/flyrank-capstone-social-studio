import axios from "axios";
import * as cheerio from "cheerio"
export const fetchDataFromUrl = async (href: string) => {
  try {
    const response = await axios.get(href, {
      headers: {
        "User-Agent": `FlyRankInternship/1.0+https://github.com/raj-prasan/`,
      },
      timeout: 7000,
    });
    if (response.status !== 200) {
    }
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export function parseHTML(html: string) {
  const $ = cheerio.load(html);
  const blogBody = $("body").text();
  return  blogBody;
}

export const getBlogContent = async(href: string)=>{
  try {
    const html = await fetchDataFromUrl(href);
    if(html){
      const blogBody =  parseHTML(html);
      if(!blogBody) throw new Error("Error in parsing")
      return blogBody;
    }
    else{
      throw new Error("Something Went Wrong While Parsing the page.")
    }
  } catch (error) {
    console.log(error)
  }
  
}