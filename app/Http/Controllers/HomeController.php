<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Pusher\Pusher;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('home');
    }

    /**
     * @param Request $request
     *
     * @return \Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
     * @throws \Pusher\PusherException
     */
    public function authenticate(Request $request)
    {
        $socketId    = $request->get('socket_id');
        $channelName = $request->get('channel_name');

        $pusher = new Pusher(
            env('PUSHER_APP_KEY'), env('PUSHER_APP_SECRET'), env('PUSHER_APP_ID'), [
                                     'cluster'   => env('PUSHER_APP_CLUSTER'),
                                     'encrypted' => true,
                                 ]
        );

        $presenceData = [
            'name' => auth()->user()->name,
        ];
        $key          = $pusher->presence_auth($channelName, $socketId, auth()->user()->id, $presenceData);

        return response($key);
    }
}
