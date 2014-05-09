using UnityEngine;
using System.Collections;

public class MenuScript : MonoBehaviour {

	private int width;
	private int height;

	// Use this for initialization
	void Start () {
		width = Screen.width;
		height = Screen.height;
		Screen.sleepTimeout = SleepTimeout.NeverSleep;
	}
	
	// Update is called once per frame
	void Update () {
	
	}

	void OnGUI() {
		if (GUI.Button(new Rect(width * 0.4f, height * 0.2f, width * 0.2f, height * 0.1f), "Start server")) {
			PlayerPrefs.SetString("GameMode", "server");
			Application.LoadLevel("GameScene");
		}
		if (GUI.Button(new Rect(width * 0.4f, height * 0.45f, width * 0.2f, height * 0.1f), "Connect to server")) {
			PlayerPrefs.SetString("GameMode", "client");
			Application.LoadLevel("GameScene");
		}
		if (GUI.Button(new Rect(width * 0.4f, height * 0.7f, width * 0.2f, height * 0.1f), "Exit game"))
			Application.Quit();
	}
}
