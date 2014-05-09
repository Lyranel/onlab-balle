using UnityEngine;
using System.Collections;

public class NetworkScript : MonoBehaviour {

	private string gameMode;

	private const string gameType = "AndroidBallE";
	private string gameName = "TestRoom";
	private string serverIP = "";

	private int width;
	private int height;

	private bool registering = false;
	private bool publicServer = false;
	private bool connecting = false;
	private bool refreshing = false;

	private HostData[] hostList;

	public GameObject playerPrefab;
	public GameObject gameScripts;
	public Camera mainCamera;
	public LayerMask menuMask;
	public LayerMask gameMask;
	
	public Vector2[] spawnPoints = {new Vector2(5,4), new Vector2(5,36), new Vector2(39,4), new Vector2(39,36)};

	// Use this for initialization
	void Start () {
		gameMode = PlayerPrefs.GetString("GameMode");
		mainCamera.cullingMask = menuMask;
		width = Screen.width;
		height = Screen.height;
	}
	
	// Update is called once per frame
	void Update () {
	
	}

	void OnGUI() {
		if (gameMode.Equals("server")) {
			if (Network.peerType == NetworkPeerType.Disconnected) {
				if (registering) {
					GUI.Label(new Rect(width * 0.65f, height * 0.3f, width * 0.2f, height * 0.05f), "Choose a room name");
					gameName = GUI.TextField(new Rect(width * 0.65f, height * 0.35f, width * 0.2f, height * 0.05f), gameName, 25);
					if (GUI.Button(new Rect(width * 0.65f, height * 0.5f, width * 0.2f, height * 0.1f), "Create room"))
					if (!gameName.Equals("")) {
						Network.InitializeServer(4, 25000, !Network.HavePublicAddress());
						MasterServer.RegisterHost(gameType, gameName);
						registering = false;
						publicServer = true;
					}
				}
				GUI.Label(new Rect(width * 0.65f, height * 0.1f, width * 0.2f, height * 0.05f), "Game server offline");
				if (GUI.Button(new Rect(width * 0.15f, height * 0.2f, width * 0.2f, height * 0.1f), "Register public server"))
					registering = true;
				if (GUI.Button(new Rect(width * 0.15f, height * 0.45f, width * 0.2f, height * 0.1f), "Start private server")) {
					Network.InitializeServer(4, 25000, !Network.HavePublicAddress());
					publicServer = false;
				}
			}
			else {		
				if (Network.peerType == NetworkPeerType.Connecting)
					GUI.Label(new Rect(width * 0.65f, height * 0.1f, width * 0.2f, height * 0.05f), "Server starting");
				else {
					GUI.Label(new Rect(width * 0.65f, height * 0.1f, width * 0.2f, height * 0.05f), "Game server online");
					GUI.Label(new Rect(width * 0.65f, height * 0.2f, width * 0.2f, height * 0.05f), "Server IP: " + Network.player.ipAddress);
					if (publicServer)
						GUI.Label(new Rect(width * 0.65f, height * 0.25f, width * 0.2f, height * 0.05f), "Room name: " + gameName);
					GUI.Label(new Rect(width * 0.65f, height * 0.3f, width * 0.2f, height * 0.05f), "Clients: " + Network.connections.Length + "/4");
				}
				if (GUI.Button(new Rect(width * 0.15f, height * 0.3f, width * 0.2f, height * 0.1f), "Stop server")) {
					Network.Disconnect();
					if (publicServer)
						MasterServer.UnregisterHost();
				}
				//if (Network.connections.Length > 1)
					if (GUI.Button(new Rect(width * 0.6f, height * 0.5f, width * 0.25f, height * 0.2f), "Start game")) {
						networkView.RPC("StartGame", RPCMode.OthersBuffered);
						mainCamera.cullingMask = gameMask;
						Instantiate(gameScripts, Vector3.zero, Quaternion.identity);
						gameMode = "game";
					}
			}
			if (GUI.Button(new Rect(width * 0.15f, height * 0.7f, width * 0.2f, height * 0.1f), "Back to Main Menu")) {
				if (Network.peerType != NetworkPeerType.Disconnected) {
					Network.Disconnect();
					if (publicServer)
						MasterServer.UnregisterHost();
				}
				Application.LoadLevel("MenuScene");
			}
		}
		else if (gameMode.Equals("client")) {
			if (Network.peerType == NetworkPeerType.Disconnected) {
				if (connecting) {
					GUI.Label (new Rect (width * 0.65f, height * 0.3f, width * 0.2f, height * 0.05f), "Choose the server IP");
					serverIP = GUI.TextField (new Rect (width * 0.65f, height * 0.35f, width * 0.2f, height * 0.05f), serverIP, 25);
					if (GUI.Button (new Rect (width * 0.65f, height * 0.5f, width * 0.2f, height * 0.1f), "Connect"))
					if (!serverIP.Equals ("")) {
						Network.Connect (serverIP, 25000);
						connecting = false;
					}
				}
				if (refreshing) {
					RefreshHostList();
					if (hostList != null)
						for (int i = 0; i < hostList.Length; i++)
							if (GUI.Button (new Rect (width * 0.65f, height * (0.3f + 0.1f * i), width * 0.2f, height * 0.1f), hostList [i].gameName))
								Network.Connect (hostList [i]);
				}
				GUI.Label(new Rect(width * 0.65f, height * 0.1f, width * 0.2f, height * 0.05f), "Game client offline");
				if (GUI.Button (new Rect (width * 0.15f, height * 0.2f, width * 0.2f, height * 0.1f), "Refresh public game list")) {
					connecting = false;
					refreshing = true;
				}
				if (GUI.Button (new Rect (width * 0.15f, height * 0.45f, width * 0.2f, height * 0.1f), "Connect to IP")) {
					connecting = true;
					refreshing = false;
				}
			}
			else {
				if (Network.peerType == NetworkPeerType.Connecting)
					GUI.Label(new Rect(width * 0.65f, height * 0.1f, width * 0.2f, height * 0.05f), "Connecting...");
				else {
					GUI.Label(new Rect(width * 0.65f, height * 0.1f, width * 0.2f, height * 0.05f), "Client connected");
					GUI.Label(new Rect(width * 0.6f, height * 0.5f, width * 0.25f, height * 0.2f), "Waiting for the game to start...");
					if (GUI.Button(new Rect(width * 0.15f, height * 0.3f, width * 0.2f, height * 0.1f), "Disconnect"))
						Network.Disconnect();
				}
			}
			if (GUI.Button(new Rect(width * 0.15f, height * 0.7f, width * 0.2f, height * 0.1f), "Back to Main Menu")) {
				if (Network.peerType != NetworkPeerType.Disconnected)
					Network.Disconnect();
				Application.LoadLevel("MenuScene");
			}
		}
		else {
			if (GUI.Button (new Rect(width * 0.85f, height * 0.85f, width * 0.1f, height * 0.1f), "Exit")) {
				Network.Disconnect();
				Application.LoadLevel("MenuScene");
			}
		}
	}

	private Vector3 GetRandomSpawnPoint() {
		bool validPoint = false;
		while (!validPoint) {
			Vector3 location = new Vector3(Mathf.Abs(Random.Range(0,8)) * 6 + 1.0f, 2.0f, Mathf.Abs(Random.Range(0,8)) * 6 - 1.0f);
			if (Physics.OverlapSphere(location, 1.5f).Length == 1) {
				location.y += 1.5f;
				return location;
			}
		}
		return new Vector3(5.0f, 3.5f, 4.0f);
	}

	private void RefreshHostList() {
		MasterServer.RequestHostList(gameType);
	}

	void OnServerInitialized() {
		Debug.Log("Server Initializied");
	}
	
	void OnConnectedToServer() {
		Debug.Log("Server Joined");
		Network.Instantiate(playerPrefab, GetRandomSpawnPoint(), Quaternion.identity, 0);
	}
	
	void OnMasterServerEvent(MasterServerEvent msEvent) {
		if (msEvent == MasterServerEvent.HostListReceived)
			hostList = MasterServer.PollHostList();
	}

	void OnPlayerConnected(NetworkPlayer player) {
	}

	void OnPlayerDisconnected(NetworkPlayer player) {
		Network.RemoveRPCs(player);
		Network.DestroyPlayerObjects(player);
	}

	[RPC]
	void StartGame() {
		gameMode = "control";
	}
}
