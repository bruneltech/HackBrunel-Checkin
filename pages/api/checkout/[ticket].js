// This very long api endpoint is used to get data for a ticketholder requested.
// Format: /api/checkin/:ticketID

const checkOutPerson = (tUUID) => {
    console.log(tUUID);
    return new Promise((resolve, reject) => {
        // Firstly going to check to see if there already is an existing checkin for this person.

        fetch(`https://checkin.tito.io/checkin_lists/chk_puX3JQxuM8vGK39xV0r2q5g/checkins/${tUUID}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                }
            })
            .then(res => res.json())
            .then(checkins => {
                if(checkins.status){
                    resolve(checkins.status);
                }else{
                    if(checkins.deleted_at == "" || checkins.deleted_at == null){
                        resolve({error: "Already checked out, or UUID does not exist."});
                    }else{
                        resolve({success: true, deletedAt: checkins.deleted_at});
                    }
                }
            })
            .catch(err => {
                reject(err);
            })
    })
}

export default async function handler(req, res) {
    const checkinUUID = req.query.ticket;

    await checkOutPerson(checkinUUID)
        .then(data => {
            console.log(data);
            if(data.status || data.error){
                res.status(500).json({error: data});
            }else{
                if(data.success == true){
                    res.status(200).json({success: true, deletedAt: data.deletedAt});
                }else{
                    res.status(500).json({error: "Unknown error"});
                }
            }
        })

}