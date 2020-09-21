let MediaRendererClient = require('upnp-mediarenderer-client');
let Client = require('node-ssdp').Client
let client = new Client();

export default class MyCasts {
    private device_descriptions: string[] = []
    private device_description_url: string | undefined = undefined
    private vedioUrl: string = ''
    private type: string = ''
    private client: any = null


    async start(vedioUrl: string, TVurl: string, type: string) {

        this.vedioUrl = vedioUrl
        this.type = type
        this.getDescription(TVurl)

    }

    getDescription(TVurl: string) {
        let tv_arr = TVurl.split('/')


        client.on('response', (headers: any, statusCode: any, rinfo: any) => {
            this.device_descriptions.push(headers.LOCATION)
            let device_decription = headers.LOCATION
            let device_arr = device_decription.split('/')
            let ip = device_arr[2].split(':')


            // console.log(tv_arr[2],ip[0]);

            if (tv_arr[2] === ip[0]) {
                this.device_description_url = device_decription
                this.setting()
            }
        });

        // search for a service type
        //   client.search('urn:schemas-upnp-org:service:ContentDirectory:1');

        // Or get a list of all services on the network

        client.search('ssdp:all');
    }

    setting() {
        if (this.client) return

        this.client = new MediaRendererClient(this.device_description_url);
        // Load a stream with subtitles and play it immediately
        var options = {
            autoplay: true,
            contentType: this.type,
            metadata: {
                title: 'Some Movie Title',
                creator: 'Author',
                type: 'video', // can be 'video', 'audio' or 'image'
                subtitlesUrl: this.vedioUrl
            }
        };
        this.client.load(this.vedioUrl, options, function (err: any, result: any) {
            if (err) throw err;
            console.log('playing ...');
        });
        // // Pause the current playing stream
        // client.pause();

        // // Unpause
        // client.play();

        // // Stop
        // client.stop();

        // // Seek to 10 minutes
        // client.seek(10 * 60);

        // // Get the volume
        // client.getVolume(function (err: any, volume: any) {
        //     if (err) throw err;
        //     console.log(volume); // the volume range is 0-100
        // });

        // // Set the volume
        // client.setVolume(40, function (err: any) {
        //     if (err) throw err;
        //     // console.log("volume is now", volume);
        // });

        // client.on('status', function (status: any) {
        //     // Reports the full state of the AVTransport service the first time it fires,
        //     // then reports diffs. Can be used to maintain a reliable copy of the
        //     // service internal state.
        //     console.log(status);
        // });

        // client.on('loading', function () {
        //     console.log('loading');
        // });

        // client.on('playing', function () {
        //     console.log('playing');

        //     client.getPosition(function (err: any, position: any) {
        //         console.log(position); // Current position in seconds
        //     });

        //     client.getDuration(function (err: any, duration: any) {
        //         console.log(duration); // Media duration in seconds
        //     });
        // });

        // client.on('paused', function () {
        //     console.log('paused');
        // });

        // client.on('stopped', function () {
        //     console.log('stopped');
        // });

        // client.on('speedChanged', function (speed: any) {
        //     // Fired when the user rewinds of fast-forwards the media from the remote
        //     console.log('speedChanged', speed);
        // });
    }
}



