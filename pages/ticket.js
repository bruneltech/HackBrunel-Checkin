import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useRouter } from 'next/router';
import {useState, useEffect} from 'react';

export default function TicketPage({query}) {
    const [ticketName, setTicketName] = useState("Please wait..");
    const [ticketSlug, setTicketSlug] = useState("");
    const [ticketID, setTicketID] = useState(false);
    const [ticketType, setTicketType] = useState("");
    const [ticketUniDetails, setTicketUniDetails] = useState({});
    const [isCheckedIn, setIsCheckedIn] = useState(false);
    const [checkinUUID, setCheckinUUID] = useState("");

    const [debounce, setDebounce] = useState(false);

    const createCheckIn = () => {
        fetch('/api/checkin/' + ticketID, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                },
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                console.log(data);
                //alert(data.error.error);
            }else{
                setIsCheckedIn(true);
                setCheckinUUID(data.uuid);
                alert("Checkin successful!");
            }
        })
    }

    const deleteCheckIn = () => {
        fetch('/api/checkout/' + checkinUUID, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                },
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                console.log(data);
                //alert(data.error.error);
            }else{
                if(data.success){
                    setIsCheckedIn(false);
                    setCheckinUUID("");
                    alert("Checkout successful!");
                }
            }
        })

    }

    useEffect(() => {
        if (query.ticketID && debounce == false) {
            setDebounce(true);
            setTicketID(query.ticketID);
            fetch('/api/ticket/' + query.ticketID, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => res.json())
            .then(data => {
                if(data.error){
                    alert("Error: " + data.error);
                    setTicketName("Error retrieving details");
                }else{
                    console.log(data);
                    setTicketName(data.name);
                    setTicketType(data.ticket_type);
                    setTicketUniDetails({uniName: data.uniName, studyLevel: data.studyLevel});
                    setTicketSlug(data.slug);
                    setTicketID(data.id);
                    setIsCheckedIn(data.checkedIn);
                    setCheckinUUID(data.checkinUUID);
                }
            })
            .catch(err => {
                console.log(err);
            })
        }
        setDebounce(false)

        return () => {
            setDebounce(false);
        }
    }, [query.ticketID]);


    return(
        <div className={styles.container}>
            <div className={styles.mainMenu}>
                <h2>Ticket Details</h2>

                <div className={styles.ticketInfo}>
                    <div className={styles.ticketInfoContent}>
                        <h3>NAME</h3>
                        <p className={styles.tickDetail}>{ticketName}</p>

                        <h3>TICKET TYPE</h3>
                        <p className={styles.tickDetail}>{ticketType}</p>

                        <h3>UNIVERSITY</h3>
                        <p className={styles.tickDetail}>{ticketUniDetails.uniName}</p>

                        <h3>COURSE TYPE</h3>
                        <p className={styles.tickDetail}>{ticketUniDetails.studyLevel}</p>

                        {isCheckedIn ? (
                            <a onClick={deleteCheckIn} className={styles.chkBtn}>
                                <p>Check Out</p>
                            </a>
                        ) : (
                            
                            <a onClick={createCheckIn} className={styles.chkBtn}>
                                <p>Check In</p>
                            </a>
                        )
                        }

                        <a href={"/scan/"} className={styles.chkBtn}>
                            <p>Scan Another Ticket</p>
                        </a>
                        
                    </div>
                </div>


            </div>
        </div>
    )
}

TicketPage.getInitialProps = async (ctx) => {
    const { query } = ctx;
    return { query };
}