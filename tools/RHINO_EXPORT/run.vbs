' Option Explicit

Sub RunAutomation
    Dim objRhino, objRhinoScript, objShell

    On Error Resume Next
    Set objRhino = CreateObject("Rhino5x64.Application")
    If Err.Number <> 0 Then
    Call WScript.Echo("Failed to create Rhino object.")
    Exit Sub
    End If
    Call WScript.Echo("Rhino object created.")

    WScript.Sleep(500)

    Call objRhino.RunScript("_-RunPythonScript ""D:\Autorhino\test.py""", 0)
    Call WScript.Echo("Script executed.")
    Set objShell = WScript.CreateObject("WScript.Shell")

    Call WScript.Echo("Done!")

End Sub

' Run the subroutine defined above
Call RunAutomation