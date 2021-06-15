/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  let res = await axios.get('http://api.tvmaze.com/search/shows', { params: { q: query } 
  }); 
  const defaultImage = "https://images.unsplash.com/photo-1623688835449-02bd59322d66?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80"

  let shows = res.data.map(result => {
    let show = result.show;
    return {
      id: show.id,
      name: show.name,
      summary: show.summary,
      image: show.image ? show.image.medium : defaultImage,
    };
  });

  return shows;
}


/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {  //note data-show-id this allows clicking to pull that ID
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">  
         <div class="card" data-show-id="${show.id}">
         <img class="card-img-top" src="${show.image}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button class="btn btn-info get-episodes">Episodes</button>
           </div>
         </div>
       </div>
      `); //literal input from tilde.  uses API repsonse to populate. 

    $showsList.append($item);
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return; //ask mentor about this line. 

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  let res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);

  let episodes = res.data.map(episode => ({ //populate the info for the episode list
    id: episode.id,
    name: episode.name,
    season: episode.season,
    number: episode.number,
  }));

  return episodes;
}
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes

  // TODO: return array-of-episode-info, as described in docstring above
function episodeList(episodes) {  //take in an episode argument, populated from the API and give the output for the HTML
  const $episodesList = $("#episodes-list");
  $episodesList.empty();

  for (let episode of episodes) { 
    let $newLI = $(  //literal output for the HTML including the info from above, name, season, number
      `<li>  
        ${episode.name},
        season: ${episode.season},
        episode: ${episode.number}
        </li>
        `);
      $episodesList.append($newLI); //add LI to const holding "#episodes-list"
  }
  $("#episodes-area").show(); //stop this area from being hidden from .hide() above. 
}

//handle click function for episodes 
$("#shows-list").on('click', ".get-episodes", async function handleClick(event){
let showId = $(event.target).closest(".Show").data("show-id"); //show-id data that was entered above and noted. 
let episodes = await getEpisodes(showId); //run function using that showId variable from click
episodeList(episodes);
})

