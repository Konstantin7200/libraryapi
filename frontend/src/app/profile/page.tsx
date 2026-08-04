import { Button, Card, CardActions, CardContent, Divider } from "@mui/material"
import st from "./page.module.scss"
import Link from "next/link"

const page = () => {
    return (
        <div className={st.page}>
            <h1>Profile</h1>
            <h2>My saved</h2>
            <div>
            <Card>
                <CardContent>
                    <h3>Lists</h3>
                    <p>
                        This is where your reading lists are stored
                    </p>
                </CardContent>
                <CardActions>
                    <Button variant="text">
                        <Link href={'/profile/list'}>View my reading lists</Link>
                    </Button>
                </CardActions>
            </Card>
            <Card>
                <CardContent>
                    <h3>Likes</h3>
                    <p>
                        This is where books you liked are stored
                    </p>
                </CardContent>
                <CardActions>
                    <Button variant="text">
                        <Link href={'/profile/likes'}>View my likes</Link>
                    </Button>
                </CardActions>
            </Card>
            </div>
            <hr/>
            <h2>My settings</h2>
            <div>
            <Card>
                <CardContent>
                    <h3>Change login</h3>
                    <p>
                        You can change your login anytime
                    </p>
                </CardContent>
                <CardActions>
                    <Button variant="text">
                        <Link href={'/profile/login'}>Change login</Link>
                    </Button>
                </CardActions>
            </Card>
            <Card>
                <CardContent>
                    <h3>Change password</h3>
                    <p>
                        You can change your password anytime. You need to remember the old password though
                    </p>
                </CardContent>
                <CardActions>
                    <Button variant="text" >
                        <Link href={'/profile/password'}>Change password</Link>
                    </Button>
                </CardActions>
            </Card>
            </div>
        </div>
    )
}
export default page