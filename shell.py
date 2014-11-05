import subprocess
import os


class Shell:
    def __init__(self):
        self.prompt = "%s $> "
        # get current directory
        self.pwd = self.execude("pwd")

    def execude(self, command):
        """
        Execudes the given command. Also
        filters requests, that contains a 'sudo' command. Returns the result
        after call is completed.
        """
        if "sudo" in command:
            return None
        command = command.split()
        if command[0] == 'cd':
            os.chdir(command[1])
            self.pwd = self.execude("pwd")
        else:
            proc = subprocess.Popen(command, stdout=subprocess.PIPE)
            return proc.stdout.read().decode("utf-8")

    def get_prompt(self):
        return (self.prompt % self.pwd[:-1])

    def run(self):
        user_input = input(self.get_prompt())
        result = self.execude(user_input)
        if result is not None:
            print(result)
        self.run()


if __name__ == '__main__':
    s = Shell()
    s.run()
