import mongoose, { Document, Schema, Model } from 'mongoose'

export interface TypeSchema extends Document {
    roomId: string,
    username: string,
    timestamp: string,
    message: string
}


const socketSchema: Schema = new Schema<TypeSchema>({
    username: { type: String },
    roomId: { type: String },
    message: { type: String },
    timestamp: { type: String, default: new Date().toISOString() }
})

const Messages: Model<TypeSchema> = mongoose.model<TypeSchema>("message", socketSchema)

export default Messages