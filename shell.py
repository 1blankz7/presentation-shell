import subprocess
import os


class Shell:
    def __init__(self):
        self.prompt = "%s $> "
        # get current directory
        self.pwd = self.execude("pwd")

    def execude(self, command):
        """
        Execudes the given command. Also filters requests, that contains a
        'sudo' command. Returns the result after call is completed.

        TODO: check if error occur and provide this information in result
        """
        if "sudo" in command:
            result = {'error': 'root is not supported'}
        else:
            command = command.split()
            if command[0] == 'cd':
                os.chdir(command[1])
                self.pwd = self.execude("pwd")
                result = {'result': ""}
            else:
                proc = subprocess.Popen(command, stdout=subprocess.PIPE)
                res = proc.stdout.read().decode("utf-8")
                result = {'result': res}
        return result

    def get_prompt(self):
        return (self.prompt % self.pwd[:-1])

    def run(self):
        user_input = input(self.get_prompt())
        result = self.execude(user_input)
        if 'error' in result:
            print("ERROR: %s" % result.error)
        else:
            print(result.result)
        self.run()


if __name__ == '__main__':
    s = Shell()
    s.run()
