// This very long api endpoint is used to get data for a ticketholder requested.
// Format: /api/checkin/:ticketID

const checkinPerson = (tID) => {
    console.log(tID);
    return new Promise((resolve, reject) => {
        // Firstly going to check to see if there already is an existing checkin for this person.

        fetch(`https://checkin.tito.io/checkin_lists/chk_puX3JQxuM8vGK39xV0r2q5g/checkins/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                }
            })
            .then(res => res.json())
            .then(checkins => {
                if (checkins.status) {
                    reject(checkins.status);
                }else{
                    let currentStatus = false;
                    for (let i = 0; i < checkins.length; i++) {
                        if (checkins[i].ticket_id == tID) {
                            currentStatus = true;
                        }
                    }
                    if (currentStatus) {
                        resolve({error: "Already checked in."});
                    }else{
                        fetch(`https://checkin.tito.io/checkin_lists/chk_puX3JQxuM8vGK39xV0r2q5g/checkins/`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json',
                            },
                            body: JSON.stringify({
                                "checkin": {
                                    "ticket_id": tID
                                }
                            })
                        })
                            .then(res => res.json())
                            .then(data => {
                                if (data.status) {
                                    reject(data.status);
                                } else {
                                    resolve(data);
                                }
                            })
                            .catch(err => {
                                reject(err);
                            })
                    }
                }
            })
            .catch(err => {
                reject(err);
            })
    })
}

export default async function handler(req, res) {
    const ticketID = req.query.ticket;

    await checkinPerson(ticketID)
        .then(data => {
            console.log(data);
            if(data.status || data.error){
                res.status(500).json({error: data});
            }else{
                if(data.id){
                    res.status(200).json({success: true, uuid: data.uuid});
                }else{
                    res.status(500).json({error: "Unknown error"});
                }
            }
        })

}