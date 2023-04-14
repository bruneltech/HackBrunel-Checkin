// This very long api endpoint is used to get data for a ticketholder requested.
// Format: /api/ticket/:ticketID

const getCheckinStatus = (ticketID) => {
  return new Promise((resolve, reject) => {
      let currentStatus = false;
      let checkinID = "";
      console.log("Getting checkin status for: " + ticketID);
      fetch(`https://checkin.tito.io/checkin_lists/${process.env.TITO_CHECKIN_LIST}/checkins/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      })
      .then(res => res.json())
      .then(checkin => {
        if (checkin.status) {
          reject(checkin.status);
        }else{
          for (let i = 0; i < checkin.length; i++) {
            if(checkin[i].ticket_id == ticketID){
              console.log("Checkin found for: " + ticketID);
              currentStatus = true;
              checkinID = checkin[i].uuid;
              break;
            }
          }
        }

        resolve({checkedin: currentStatus, checkinuuid: checkinID});
      })
      .catch(err => {
        reject(err);
      })
  })

}

const getAnswers = (ticketSlug, questionSlug) => {
  return new Promise((resolve, reject) => {
    fetch(`https://api.tito.io/v3/${process.env.TITO_ACCOUNT_NAME}/${process.env.TITO_EVENT_SLUG}/questions/${questionSlug}/answers`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Token token=${process.env.TITO_API_KEY}`,
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.status) {
          reject(data.status);
        } else {
          if (data.meta.total_pages > 1) {
            let currentPage = 1;

            for (currentPage; currentPage <= data.meta.total_pages; currentPage++) {
              console.log("Page: " + currentPage);
              fetch(`https://api.tito.io/v3/${process.env.TITO_ACCOUNT_NAME}/${process.env.TITO_EVENT_SLUG}/questions/${questionSlug}/answers?page=` + currentPage, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json',
                  'Authorization': 'Token token=' + process.env.TITO_API_KEY
                },
              })
                .then(res => res.json())
                .then(data => {
                  if (data.status) {
                    reject(data.status);
                  } else {
                    data.answers.forEach((answerList) => {
                      if (answerList.ticket_slug === ticketSlug) {
                        resolve(answerList);
                      }
                    })
                  }
                })
                .catch(err => {
                  reject(err);
                })
            }
          } else {
            data.answers.forEach((answerList) => {
              if (answerList.ticket_slug === ticketSlug) {
                resolve(answerList);
              }
            })
          }
        }
      })
      .catch(err => {
        reject(err);
      })
  })
}

// Create a promise to get all tickets.
const getTickets = (ticketSlug) => {
  let selTicket;

  return new Promise((resolve, reject) => {
    fetch(`https://api.tito.io/v3/${process.env.TITO_ACCOUNT_NAME}/${process.env.TITO_EVENT_SLUG}/tickets`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Token token=' + process.env.TITO_API_KEY
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.status) {
          reject(data.status);
        } else {
          if (data.meta.total_pages > 1) {
            let currentPage = 1;

            for (currentPage; currentPage <= data.meta.total_pages; currentPage++) {
              console.log("Page: " + currentPage);
              fetch(`https://api.tito.io/v3/${process.env.TITO_ACCOUNT_NAME}/${process.env.TITO_EVENT_SLUG}/tickets?search[states][]=complete&page=` + currentPage, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json',
                  'Authorization': 'Token token=' + process.env.TITO_API_KEY
                },
              })
                .then(res => res.json())
                .then(tickData => {
                  if (tickData.status) {
                    reject(tickData.status);
                  } else {
                    tickData.tickets.forEach(tick => {
                      if (tick.slug == ticketSlug) {
                        //resolve(tick);
                        selTicket = tick;
                        let tickAns = [];
                        getAnswers(ticketSlug, 'university')
                          .then((answers) => {
                            tickAns[0] = answers.response;
                          })
                          .then(() => {
                            getAnswers(ticketSlug, 'study-level')
                              .then((answers) => {
                                tickAns[1] = answers.response;
                                getCheckinStatus(tick.id)
                                  .then((checkinStatus) => {
                                    let ticket = {
                                      name: tick.name,
                                      slug: tick.slug,
                                      id: tick.id,
                                      ticket_type: tick.release_title,
                                      uniName: tickAns[0],
                                      studyLevel: tickAns[1],
                                      checkedIn: checkinStatus.checkedin,
                                      checkinUUID: checkinStatus.checkinuuid
                                    }
                                    resolve(ticket);
                                  })
                              })
                              .catch(err => {
                                reject(err);
                              })
                          }).catch((err) => {
                            reject(err);
                          })
                      }
                    });
                  }
                })
                .catch(err => {
                  reject(err);
                })
            }
          } else {
            data.tickets.forEach(tick => {
              //ticketList.push(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
              //ticketList.push(tick);
              if (tick.slug == ticketSlug) {
                //resolve(tick);
                selTicket = tick;
                getAnswers(ticketSlug, 'university')
                  .then((answers) => {
                    tickAns[0] = answers.response;
                  })
                  .then(() => {
                    getAnswers(ticketSlug, 'study-level')
                      .then((answers) => {
                        tickAns[1] = answers.response;
                        getCheckinStatus(tick.id)
                          .then((checkinStatus) => {
                            let ticket = {
                              name: tick.name,
                              slug: tick.slug,
                              id: tick.id,
                              ticket_type: tick.release_title,
                              uniName: tickAns[0],
                              studyLevel: tickAns[1],
                              checkedIn: checkinStatus
                            }
                            resolve(ticket);
                          })
                      })
                      .catch(err => {
                        reject(err);
                      })
                  }).catch((err) => {
                    reject(err);
                  })
              }
            });
          }
        }
      })
      .catch(err => {
        reject(err);
      }
      )
  })
}


export default async function handler(req, res) {
  // Get the ticket ID from the URL
  const ticketSlug = req.query.ticket;

  let ticketName = "";
  let ticketID = "";
  let ticketType = "";
  let ticketUniDetails = {};

  let allTickets = new Array();

  if (ticketSlug == undefined) {
    return res.status(400).json({ error: "No ticket ID provided" });
  } else {
    getTickets(ticketSlug)
      .then(ticket => {
        if (ticket == undefined) {
          return res.status(400).json({ error: ticket.error });
        } else {
          return res.status(200).json(ticket);
        }
      })
  }
}