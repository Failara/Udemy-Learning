namespace Domain;

public class Fact
{
    public int Id { get; set; }
    public string Text { get; set; }
    public string Source { get; set; }
    public string Category { get; set; }
    public int VoteInteresting { get; set; }
    public int VoteMindblowing { get; set; }
    public int VoteFalse { get; set; }
}