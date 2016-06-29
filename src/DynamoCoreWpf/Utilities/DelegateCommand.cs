using System;
using System.Windows.Input;
using Dynamo.Utilities;

namespace Dynamo.UI.Commands
{
    /// <summary>
    /// Custom implementation of DelegateCommand which prints to the log.
    /// </summary>
    public class DelegateCommand : ICommand
    {
        //http://wpftutorial.net/DelegateCommand.html

        private readonly Predicate<object> _canExecute;
        private readonly Action<object> _execute;
        private bool _trackAnalytics = false;
        private IDisposable logEvent;

        public event EventHandler CanExecuteChanged;

        public DelegateCommand(Action<object> execute)
            : this(execute, null)
        {
        }

        public DelegateCommand(Action<object> execute,
                       Predicate<object> canExecute,
                       bool trackAnalytics = false)
        {
            _execute = execute;
            _canExecute = canExecute;
            _trackAnalytics = trackAnalytics;
        }

        public bool CanExecute(object parameter)
        {
            return _canExecute == null || _canExecute(parameter);
        }

        public void Execute(object parameter)
        {
            OnExecuteStart();
            _execute(parameter);
            OnExecuteComplete();
        }

        private void OnExecuteStart()
        {
            if (_trackAnalytics)
            {
                var name = _execute.Method.Name;
                if (!string.IsNullOrEmpty(name))
                    logEvent = Dynamo.Logging.Analytics.CreateCommandEvent(name);
            }
        }

        private void OnExecuteComplete()
        {
            if (_trackAnalytics)
            {
                logEvent.Dispose();
                logEvent = null;
            }
        }

        public void RaiseCanExecuteChanged()
        {
            if (CanExecuteChanged != null)
            {
                CanExecuteChanged(this, EventArgs.Empty);
            }
        }

    }

}
