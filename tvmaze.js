// "use strict";

// const $showsList = $("#shows-list");
// const $episodesArea = $("#episodes-area");
// const $searchForm = $("#search-form");
const noImage = "http://tinyurl.com/missing-tv";


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(query) {
  let response = await axios.get(`http://api.tvmaze.com/search/shows?q=${query}`);
  let shows = response.data.map(result => {
    let show = result.show;
    return { 
      id: show.id,
      name: show.name,
      summary: show.summary,
      image: show.image ? show.image.medium : noImage, 
    };
  });  
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  return shows;
}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $show = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
      <div class="card" data-show-id="${show.id}">
        <img class="card-img-top" src="${show.image}">
        <div class="card-body">
          <h5 class="card-title">${show.name}</h5>
          <p class="card-text">${show.summary}</p>
          <button class="btn btn-primary get-episodes">Episodes</button>
        </div>
      </div>  
    </div>
   `);
    $showsList.append($show);  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  let shows = await getShowsByTerm(query);

  $("episodes-area").hide();

  populateShows(shows);
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */
async function getEpisodes(id) {
  let response = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);

  let episodes = response.data.map(episode => ({
    id: episode.id,
    name: episode.name,
    season: episode.seasom,
    number: episode.number,
  }));
  return episodes;
}

// async function getEpisodesOfShow(id) { }

/** Write a clear docstring for this function... */

// function populateEpisodes(episodes) { }
function populateEpisodes(episodes) {
  let $episodesList = $("#episode-list");
  $episodesList.empty();

  for (let episode of episodes) {
    let $episode = $(
      `<li>
         ${episode.name}
         (season ${episode.season}, episode ${episode.number})
       </li>
      `);
    $episodesList.append($episode);
  }
  $("#episodes-area").show();
}

$("#shows-list").on("click", ".get-episodes", async function handleEpisodeClick(evt) {
  let showId = $(evt.target).closest(".Show").data("show-id");
  let episodes = await getEpisodes(showId);
  populateEpisodes(episodes);
});


