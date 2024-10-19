
import { Socket, Server } from 'socket.io'
import Messages, { TypeSchema } from '../modals/SocketModal'

export const socketControllers = (io: Server) => {
    io.on("connection", (socket: Socket) => {
        console.log(`user connected with this id ${socket.id}`)

        socket.on("join_room", async (roomId: string) => { //join room
            socket.join(roomId)
            try {
                const message = await Messages.find({ roomId }).exec()
                if (message.length > 0) {
                    socket.emit("load_message", message) //load prev msg
                    console.log("loading message", message)
                } else socket.emit("no message found with this id")
            } catch (error) {
                console.error(`Error while loading messages for roomId ${roomId}:`, error);
                socket.emit("error_message", { error: "Error loading messages. Please try again." });
            }
        })

        socket.on("send_message", async (data: TypeSchema) => {
            try {
                const newMessage: TypeSchema = new Messages({
                    roomId: data.roomId,
                    username: data.username,
                    timestamp: data.timestamp,
                    message: data.message
                })
                const savedMessage = await newMessage.save()
                socket.to(data.roomId).emit("recive_message", savedMessage) //send msg to db
            } catch (error) {
                console.error("Error while sending message:", error);
                socket.emit("error_message", { error: "Message could not be sent. Please try again." });
            }
        })

        socket.on("disconnect", () => {
            console.log(`User with id ${socket.id} disconnected`);
        })
    })
}