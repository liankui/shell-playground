package main

import (
	"bytes"
	"fmt"
	"net/http"
	"os/exec"
)

func main() {
	http.HandleFunc("/run", runCodeHandler)
	http.Handle("/", http.FileServer(http.Dir("./static"))) // Serve static files from the static directory
	fmt.Println("Starting server on :21110")
	if err := http.ListenAndServe(":21110", nil); err != nil {
		panic(err)
	}
}

func runCodeHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	// Read the code from the request
	code := r.FormValue("code")
	if code == "" {
		http.Error(w, "No code provided", http.StatusBadRequest)
		return
	}

	// Run the Go code using a subprocess
	cmd := exec.Command("/bin/bash", "-c", code)
	var out bytes.Buffer
	var errOut bytes.Buffer
	cmd.Stdout = &out
	cmd.Stderr = &errOut

	if err := cmd.Run(); err != nil {
		http.Error(w, errOut.String(), http.StatusInternalServerError)
		return
	}

	// Return the output
	_, _ = w.Write([]byte(out.String()))
}
