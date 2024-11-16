interface PeerConnection {
  pc: RTCPeerConnection;
  streamId: string;
}

const peerConnections = new Map<string, PeerConnection>();

const configuration: RTCConfiguration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    // Add TURN servers in production
  ]
};

export async function setupWebRTC(streamId: string, isHost: boolean) {
  const pc = new RTCPeerConnection(configuration);
  
  if (isHost) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      stream.getTracks().forEach(track => {
        pc.addTrack(track, stream);
      });
      
      return stream;
    } catch (err) {
      console.error("Failed to get user media:", err);
      throw err;
    }
  } else {
    const remoteStream = new MediaStream();
    
    pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach(track => {
        remoteStream.addTrack(track);
      });
    };

    // Here you would implement the signaling logic to connect to the host
    // This is a simplified version - you'll need a proper signaling server
    
    return remoteStream;
  }
}

export function cleanupWebRTC(streamId: string) {
  const connection = peerConnections.get(streamId);
  if (connection) {
    connection.pc.close();
    peerConnections.delete(streamId);
  }
}
